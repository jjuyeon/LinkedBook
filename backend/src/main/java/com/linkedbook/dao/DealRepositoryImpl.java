package com.linkedbook.dao;

import java.util.ArrayList;
import java.util.List;

import com.linkedbook.dto.deal.selectDeal.QSelectDealOutput;
import com.linkedbook.dto.deal.selectDealDetail.QSelectDealDetailOutput;
import com.linkedbook.dto.deal.selectDeal.SelectDealInput;
import com.linkedbook.dto.deal.selectDeal.SelectDealOutput;
import com.linkedbook.dto.deal.selectDealDetail.SelectDealDetailOutput;
import com.linkedbook.entity.QBookDB;
import com.linkedbook.entity.QDealDB;
import com.linkedbook.entity.QDealImageDB;
import com.linkedbook.entity.QImageDB;
import com.linkedbook.entity.QLikeDealDB;
import com.linkedbook.entity.QUserDB;
import com.linkedbook.entity.QUserAreaDB;
import com.linkedbook.entity.QAreaDB;
import com.linkedbook.entity.QUserDealDB;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DealRepositoryImpl implements DealRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    QDealDB dealDB = QDealDB.dealDB;
    QBookDB bookDB = QBookDB.bookDB;
    QDealImageDB dealImageDB = QDealImageDB.dealImageDB;
    QImageDB imageDB = QImageDB.imageDB;
    QLikeDealDB likeDealDB = QLikeDealDB.likeDealDB;
    QUserDB userDB = QUserDB.userDB;
    QUserAreaDB userAreaDB = QUserAreaDB.userAreaDB;
    QAreaDB areaDB = QAreaDB.areaDB;
    QUserDealDB userDealDB = QUserDealDB.userDealDB;

    @Override
    public Page<SelectDealOutput> findDynamicQueryDeal(SelectDealInput selectDealInput, Integer userId,
            Pageable pageable) {

        List<SelectDealOutput> queryResult = queryFactory
                .select(new QSelectDealOutput(dealDB.id, dealDB.title, imageDB.imageurl.coalesce("").as("imageurl"),
                        dealDB.price, dealDB.quality, dealDB.created_at,
                        JPAExpressions.select(likeDealDB.count().castToNum(Integer.class)).from(likeDealDB)
                                .where(likeDealDB.user.id.eq(userId).and(likeDealDB.deal.id.eq(dealDB.id))),
                        bookDB.title, bookDB.author, bookDB.publisher))
                .from(dealDB).join(dealDB.user, userDB).join(userDB.userAreaDBs, userAreaDB).on(userAreaDB.orders.eq(1))
                .join(dealDB.book, bookDB).leftJoin(dealDB.images, dealImageDB).on(dealImageDB.orders.eq(1))
                .leftJoin(dealImageDB.image, imageDB)
                .where(eqSearch(selectDealInput.getSearch()), eqUserId(selectDealInput.getUserId()),
                        eqBookId(selectDealInput.getBookId()), eqAreaId(selectDealInput.getAreaId()),
                        dealDB.status.eq("ACTIVATE"), dealDB.user.status.eq("ACTIVATE"))
                .orderBy(getOrderSpecifier(pageable.getSort()).stream().toArray(OrderSpecifier[]::new))
                .offset(pageable.getOffset()).limit(pageable.getPageSize()).fetch();
        List<SelectDealOutput> content = queryResult;
        long totalCount = queryResult.size();
        return new PageImpl<>(content, pageable, totalCount);
    }

    @Override
    public SelectDealDetailOutput findDealDetail(Integer dealId, Integer userId) {

        return queryFactory
                .select(new QSelectDealDetailOutput(dealDB.id, dealDB.title, dealDB.content, dealDB.price,
                        dealDB.quality, dealDB.created_at, dealDB.status,
                        JPAExpressions.select(likeDealDB.count().castToNum(Integer.class)).from(likeDealDB)
                                .where(likeDealDB.user.id.eq(userId).and(likeDealDB.deal.id.eq(dealDB.id))),
                        bookDB.id, bookDB.title, bookDB.author, bookDB.publisher, bookDB.price, userDB.id,
                        userDB.nickname, userDB.image, areaDB.dongmyeonri, userDealDB.score.avg()))
                .from(dealDB).join(dealDB.user, userDB).join(userDB.userAreaDBs, userAreaDB).on(userAreaDB.orders.eq(1))
                .join(dealDB.book, bookDB).join(userAreaDB.area, areaDB).leftJoin(userDealDB)
                .on(dealDB.user.id.eq(userDealDB.user.id))
                .where(dealDB.id.eq(dealId), dealDB.status.eq("ACTIVATE").or(dealDB.status.eq("COMPLETE")),
                        dealDB.user.status.eq("ACTIVATE"))
                .groupBy(dealDB.user.id).fetchOne();
    }

    private BooleanExpression eqSearch(String search) {
        if (StringUtils.isEmpty(search)) {
            return null;
        }
        return bookDB.title.contains(search).or(dealDB.title.contains(search));
    }

    private BooleanExpression eqUserId(Integer userId) {
        if (StringUtils.isEmpty(userId)) {
            return null;
        }
        return dealDB.user.id.eq(userId);
    }

    private BooleanExpression eqBookId(String bookId) {
        if (StringUtils.isEmpty(bookId)) {
            return null;
        }
        return dealDB.book.id.eq(bookId);
    }

    private BooleanExpression eqAreaId(Integer areaId) {
        if (StringUtils.isEmpty(areaId)) {
            return null;
        }
        return userAreaDB.area.id.eq(areaId);
    }

    private List<OrderSpecifier> getOrderSpecifier(Sort sort) {
        List<OrderSpecifier> orders = new ArrayList<>();
        sort.stream().forEach(order -> {
            Order direction = order.isAscending() ? Order.ASC : Order.DESC;
            String prop = order.getProperty();
            PathBuilder pathBuilder = new PathBuilder(dealDB.getType(), dealDB.getMetadata());
            orders.add(new OrderSpecifier(direction, pathBuilder.get(prop)));
        });
        return orders;
    }
}