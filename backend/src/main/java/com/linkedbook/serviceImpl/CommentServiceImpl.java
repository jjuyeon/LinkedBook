package com.linkedbook.serviceImpl;

import com.linkedbook.configuration.ValidationCheck;
import com.linkedbook.dao.BookRepository;
import com.linkedbook.dao.CommentRepository;
import com.linkedbook.dao.LikeCommentRepository;
import com.linkedbook.dto.comment.*;
import com.linkedbook.entity.BookDB;
import com.linkedbook.entity.CommentDB;
import com.linkedbook.entity.UserDB;
import com.linkedbook.response.Response;
import com.linkedbook.service.CommentService;
import com.linkedbook.service.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.linkedbook.response.ResponseStatus.*;

@Service("CommentService")
@AllArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final LikeCommentRepository likeCommentRepository;
    private final BookRepository bookRepository;
    private final JwtService jwtService;

    @Override
    @Transactional
    public Response<Object> createComment(CommentInput commentInput) {
        // 1. 값 형식 체크
        if (commentInput == null) return new Response<>(NO_VALUES);
        if (!ValidationCheck.isValid(commentInput.getIsbn())
                || !ValidationCheck.isValid(commentInput.getContent())
                || !ValidationCheck.isValidScore(commentInput.getScore())
        )
            return new Response<>(BAD_REQUEST);
        // 2. 한줄평 정보 생성
        CommentDB commentDB;
        try {
            UserDB loginUserDB = jwtService.getUserDB();
            if(loginUserDB == null) {
                log.error("[comments/post] NOT FOUND LOGIN USER error");
                return new Response<>(NOT_FOUND_USER);
            }
            BookDB bookDB = bookRepository.findById(commentInput.getIsbn()).orElse(null);
            if (bookDB == null) {
                log.error("[comments/post] NOT FOUND BOOK error");
                return new Response<>(NOT_FOUND_BOOK);
            }
            if(commentRepository.existsByUserAndBook(loginUserDB, bookDB)) {
                log.error("[comments/post] DUPLICATE COMMENT INFO error");
                return new Response<>(EXISTS_INFO);
            }

            commentDB = CommentDB.builder()
                    .user(loginUserDB)
                    .book(bookDB)
                    .score(commentInput.getScore())
                    .content(commentInput.getContent())
                    .build();

            commentRepository.save(commentDB);
        } catch (Exception e) {
            log.error("[comments/post] database error", e);
            return new Response<>(DATABASE_ERROR);
        }
        // 3. 결과 return
        return new Response<>(null, CREATED_COMMENT);
    }

    @Override
    @Transactional
    public Response<Object> updateComment(int id, CommentInput commentInput) {
        // 1. 값 형식 체크
        if (commentInput == null) return new Response<>(NO_VALUES);
        if (!ValidationCheck.isValidId(id)
                || !ValidationCheck.isValid(commentInput.getContent())
                || !ValidationCheck.isValidScore(commentInput.getScore())
        )
            return new Response<>(BAD_REQUEST);
        // 2. 한줄평 정보 수정
        CommentDB commentDB;
        try {
            UserDB loginUserDB = jwtService.getUserDB();
            if(loginUserDB == null) {
                log.error("[comments/patch] NOT FOUND LOGIN USER error");
                return new Response<>(NOT_FOUND_USER);
            }
            commentDB = commentRepository.findById(id).orElse(null);
            if (commentDB == null || commentDB.getUser().getId() != loginUserDB.getId()) {
                log.error("[comments/patch] NOT FOUND COMMENT error");
                return new Response<>(NOT_FOUND_COMMENT);
            }

            commentDB.setScore(commentInput.getScore());
            commentDB.setContent(commentInput.getContent());

            commentRepository.save(commentDB);
        } catch (Exception e) {
            log.error("[comments/patch] database error", e);
            return new Response<>(DATABASE_ERROR);
        }
        // 3. 결과 return
        return new Response<>(null, SUCCESS_CHANGE_COMMENT);
    }

    @Override
    @Transactional
    public Response<Object> deleteComment(int id) {
        // 1. 값 형식 체크
        if (!ValidationCheck.isValidId(id)) return new Response<>(BAD_REQUEST);
        // 2. 한줄평 정보 삭제
        try {
            int loginUserId = jwtService.getUserId();
            if(loginUserId < 0) {
                log.error("[comments/delete] NOT FOUND LOGIN USER error");
                return new Response<>(NOT_FOUND_USER);
            }
            CommentDB commentDB = commentRepository.findById(id).orElse(null);
            if(commentDB == null || commentDB.getUser().getId() != loginUserId) {
                log.error("[comments/delete] NOT FOUND COMMENT error");
                return new Response<>(NOT_FOUND_COMMENT);
            }

            commentRepository.deleteById(id);
        } catch (Exception e) {
            log.error("[comments/delete] database error", e);
            return new Response<>(DATABASE_ERROR);
        }
        // 3. 결과 return
        return new Response<>(null, SUCCESS_DELETE_COMMENT);
    }

    @Override
    public Response<List<CommentOutput>> getCommentList(CommentSearchInput commentSearchInput, boolean isUserPage) {
        // 1. 값 형식 체크
        if(!ValidationCheck.isValidPage(commentSearchInput.getPage())
                || !ValidationCheck.isValidId(commentSearchInput.getSize()))  return new Response<>(BAD_REQUEST);
        // 2. 일치하는 한줄평 정보 가져오기
        List<CommentOutput> responseList = new ArrayList<>();
        try {
            Pageable paging = PageRequest.of(commentSearchInput.getPage(), commentSearchInput.getSize(), Sort.Direction.DESC, "id");
            // 필요한 정보 가공
            List<CommentDB> commentDBList;
            if(isUserPage) { // 유저 프로필 페이지에서 조회할 때
                commentDBList = commentRepository.findByUser(new UserDB(commentSearchInput.getUserId()), paging);
            } else { // 책 상세 페이지에서 조회할 때
                commentDBList = commentRepository.findByBook(new BookDB(commentSearchInput.getBookId()), paging);
            }

            UserDB loginUserDB = new UserDB(jwtService.getUserId());
            for (CommentDB commentDB : commentDBList) {
                UserDB commentUserDB = commentDB.getUser();
                BookDB commentBookDB = commentDB.getBook();
                boolean isUserLikeComment = likeCommentRepository.existsByUserAndComment(loginUserDB, commentDB);
                // 최종 출력값 정리
                responseList.add(
                        CommentOutput.builder()
                                .commentId(commentDB.getId())
                                .commentScore(commentDB.getScore())
                                .commentContent(commentDB.getContent())
                                .created_at(commentDB.getCreated_at())
                                .updated_at(commentDB.getUpdated_at())
                                .likeCommentCnt(commentDB.getLikeComments().size())
                                .userLikeComment(isUserLikeComment)
                                .userId(commentUserDB.getId())
                                .userNickname(commentUserDB.getNickname())
                                .userImage(commentUserDB.getImage())
                                .bookId(commentBookDB.getId())
                                .bookTitle(commentBookDB.getTitle())
                                .bookImage(commentBookDB.getImage())
                                .build()
                );
            }
        } catch (Exception e) {
            log.error("[comments/get] database error", e);
            return new Response<>(DATABASE_ERROR);
        }
        // 3. 결과 return
        return new Response<>(responseList, SUCCESS_GET_COMMENT_LIST);
    }
}
