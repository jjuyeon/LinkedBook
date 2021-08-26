import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { showToast } from "../../../actions/Notification";
import { Check, Plus, Search, Square, Upc, X } from "react-bootstrap-icons";
import FooterButton from "../../../components/common/Buttons/FooterButton";
import BookItem from "../../../components/deal/BookItem";
import Header from "../../../components/Layout/Header";
import useInput from "../../../hooks/useInput";
import {
  BookInfo,
  ImageContainer,
  InputContainer,
  QualityContainer,
  TextContainer,
  Wrapper,
  CheckBoxContainer,
} from "./style";
import ReactS3Client from "../../../S3.js";
import { request } from "../../../api.js";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { doRefresh } from "../../../actions/Deal";

export default function CreateDeal() {
  const [search, setSearch] = useState("");
  const [bookInfo, setBookInfo] = useState({});
  const dealTitle = useInput("");
  const dealPrice = useInput("");
  const dealContent = useInput("");
  const [quality, setQuality] = useState("상");
  const [searchList, setSearchList] = useState([]);
  const [listShow, setListShow] = useState(false);
  const [postImg, setPostImg] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [updateDealData, setUpdateDealData] = useState(
    location.state?.dealData
  );
  const [checkedList, setCheckedList] = useState([false, false, false, false]);
  const [buttonEnable, setButtonEnable] = useState(true);

  useEffect(() => {
    if (isUpdatePage() && !location.state) {
      history.goBack();
    }
    setUpdateData();
  }, []);

  useEffect(() => {
    calcPrice();
  }, [checkedList]);

  useEffect(() => {
    calcPrice();
  }, [bookInfo]);

  function calcPrice() {
    let price = bookInfo.price;
    let discountPercent = 0;
    const today = new Date();
    const bookDate = new Date(bookInfo.datetime);
    const diff = today - bookDate;
    const diffYear = diff / (24 * 60 * 60 * 1000 * 30 * 12);
    if (diffYear < 1) {
    } else if (diffYear < 5) {
      discountPercent += 10;
    } else if (diffYear < 10) {
      discountPercent += 15;
    } else {
      discountPercent += 20;
    }

    const checkedCount = checkedList.filter((checked) => checked).length;
    if (checkedCount <= 1) {
      discountPercent += 30;
      setQuality("상");
    } else if (checkedCount <= 3) {
      discountPercent += 45;
      setQuality("중");
    } else {
      discountPercent += 60;
      setQuality("하");
    }
    price = parseInt((price * (100 - discountPercent)) / 100);
    price -= price % 100;
    dealPrice.setValue(price);
  }

  function setUpdateBookData() {
    setBookInfo({
      title: updateDealData.bookTitle,
      author: updateDealData.bookAuthor,
      publisher: updateDealData.bookPublisher,
      price: parseInt(updateDealData.bookPrice),
      datetime: updateDealData.bookDateTime,
    });
  }
  function setUpdateData() {
    if (!updateDealData) return;
    setUpdateBookData();
    setQuality(updateDealData.dealQuality);
    setPostImg(updateDealData.dealImages);
    dealTitle.setValue(updateDealData.dealTitle);
    dealContent.setValue(updateDealData.dealContent);
  }
  function isUpdatePage() {
    return location.pathname === "/update/deal" ? true : false;
  }

  // 등록 전 인풋, 책 정보 체크
  function validCheck() {
    if (!bookInfo.title) {
      dispatch(showToast("책을 선택하세요."));
      return false;
    }
    if (!dealTitle.value) {
      dispatch(showToast("제목을 입력하세요."));
      return false;
    }
    if (!dealPrice.value) {
      dispatch(showToast("가격을 입력하세요."));
      return false;
    }
    if (!dealContent.value) {
      dispatch(showToast("내용을 입력하세요."));
      return false;
    }
    return true;
  }

  // s3 서버에 업로드 할 유니크한 파일 이름
  function getFileName(file, i) {
    const today = new Date();
    const fileName = `deal-${today.getFullYear()}${
      today.getMonth() + 1
    }${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}${today.getMilliseconds()}${i}${
      file.name
    }`;
    return fileName;
  }

  // s3 서버에 이미지 업로드 하고 {url, order} 리스트 반환
  async function getImages() {
    if (postImg.length === 0) return new Array(0);
    const images = [];
    for (let i = 0; i < postImg.length; i++) {
      const image = postImg[i];
      if (image.files) {
        const file = image.files[0];
        const newFileName = getFileName(file, i);
        await ReactS3Client.uploadFile(file, newFileName)
          .then((data) => {
            images.push({
              imageUrl: data.location,
              orders: i + 1,
            });
          })
          .catch((err) => console.error(err));
      } else {
        images.push({ imageUrl: image.imageurl, orders: i + 1 });
      }
    }
    return images;
  }
  // 상품 등록
  async function createDeal() {
    if (!buttonEnable) return;
    const valid = validCheck();
    if (!valid) return;
    setButtonEnable(false);
    const images = await getImages();

    if (isUpdatePage()) {
      const data = {
        title: dealTitle.value,
        price: parseInt(dealPrice.value),
        quality: quality,
        content: dealContent.value,
        images: images,
      };
      if (bookInfo.isbn) {
        data.bookId = bookInfo.isbn.split(" ")[1];
      }
      const result = await request(
        "PATCH",
        `/deals/${updateDealData.dealId}`,
        data
      );
      if (result.isSuccess) {
        dispatch(showToast("거래 수정이 완료되었습니다."));
      } else {
        dispatch(showToast("거래 수정 실패"));
      }
      dispatch(doRefresh());
      history.push({ pathname: "/" });
    } else {
      const data = {
        bookId: bookInfo.isbn.split(" ")[1],
        title: dealTitle.value,
        price: parseInt(dealPrice.value),
        quality: quality,
        content: dealContent.value,
        images: images,
      };
      const response = await request("POST", "/deals", data);
      if (response.isSuccess) {
        dispatch(showToast("판매 등록이 완료되었습니다."));
      }
      setButtonEnable(true);
      history.push({ pathname: "/" });
    }
  }
  // 책 검색 결과 리스트 보이기
  function showList() {
    setListShow(true);
  }
  // 책 검색 결과 리스트 숨기기
  function hideList() {
    setListShow(false);
  }
  // 책 검색 결과 리스트에서 책 클릭 이벤트 처리
  async function handleBookClick(book) {
    const data = {
      isbn: book.isbn.split(" ")[1],
      title: book.title,
      contents: book.contents,
      price: book.price,
      author: book.authors,
      publisher: book.publisher,
      dateTime: book.datetime,
      thumbnail: book.thumbnail,
      status: book.status,
    };
    const response = await request("POST", "/books", data);
    if (response.isSuccess) {
      setBookInfo(book);
    } else {
      dispatch(showToast("등록할수 없는 책입니다."));
    }
  }
  // 책 검색 인풋 onChange 처리
  function handleSearchChange(e) {
    setSearch(e.target.value);
  }
  // 책 제목인지 isbn인지
  function getTarget() {
    if (search.length >= 10 && parseInt(search) === search) return "isbn";
    else return "title";
  }
  // 파일읽기
  function handleImageReader(file) {
    // 보여주기 위한 사진정보를 추출
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }
  // 사용자가 업로드한 이미지 postImg state에 저장
  async function handleImageCreate(e) {
    const fileNm = e.target.value;
    const fileList = e.target.files;
    if (!fileNm) {
      return false;
    }
    const ext = fileNm.slice(fileNm.lastIndexOf(".") + 1).toLowerCase();
    if (!(ext === "gif" || ext === "jpg" || ext === "png" || ext === "jpeg")) {
      dispatch(
        showToast("이미지파일 (.jpg, .png, .gif ) 만 업로드 가능합니다.")
      );
      e.target.value = "";
      return false;
    }
    if (postImg.length + fileList.length > 5) {
      dispatch(showToast("이미지파일은 5개까지 업로드 가능합니다."));
      return false;
    }
    Array.from(fileList).forEach(async (file) => {
      let imgUrl = await handleImageReader(file);
      let tempImage = {
        imgUrl: imgUrl,
        files: [file],
      };
      let postImage = postImg;
      postImage.push(tempImage);
      setPostImg([...postImage]);
    });
  }

  // 책 검색 결과 searchList state에 저장
  async function fetchData(page = 1) {
    const target = getTarget();
    await axios
      .get(
        `https://dapi.kakao.com/v3/search/book?target=${target}&query=${search}&page=${page}&size=10`,
        {
          headers: {
            Authorization: "KakaoAK 781ed2f07eb684a67bab44bffdcf861b",
          },
        }
      )
      .then((res) => {
        page === 1
          ? setSearchList(res.data.documents)
          : setSearchList(searchList.concat(res.data.documents));
        if (res.data.documents.length === 0) hideList();
        else showList();
      })
      .catch((err) => {
        setSearchList([]);
        hideList();
      });
  }

  // infinite scroll 처리
  function getNextBookData() {
    if (searchList.length % 10 !== 0) {
      return;
    }
    const page = parseInt(searchList.length / 10) + 1;
    fetchData(page);
  }
  // infinite scroll 처리
  function handleScroll(e) {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight < scrollHeight) return;
    getNextBookData();
  }
  function priceToString(price) {
    return price ? price.toLocaleString() : 0;
  }

  useEffect(() => {
    if (search) {
      fetchData();
    } else {
      hideList();
    }
  }, [search]);

  return (
    <>
      <Header isBack title={isUpdatePage() ? "수정하기" : "판매하기"} />
      <Wrapper onClick={hideList}>
        <InputContainer>
          <div className="input-container">
            <input
              type="text"
              placeholder="책 제목, ISBN"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchList.length > 0) showList();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <span className="search-icon">
              <Search />
            </span>
            {listShow ? (
              <div className="search-list" onScroll={handleScroll}>
                {searchList.map((item, key) => (
                  <BookItem
                    book={item}
                    key={key}
                    onBookClick={handleBookClick}
                  />
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <span className="barcode-icon">
            <Upc />
          </span>
        </InputContainer>
        <BookInfo>
          <div className="title">{bookInfo.title ?? "책 제목"}</div>
          <div className="author-publisher">
            {bookInfo.authors ?? "지은이"} | {bookInfo.publisher ?? "출판사"}
          </div>
        </BookInfo>
        <ImageContainer>
          {postImg.map((image, i) => (
            <div
              className="image box"
              key={i}
              onClick={() => {
                setPostImg([
                  postImg[i],
                  ...postImg.filter((img, idx) => idx !== i),
                ]);
              }}
            >
              <img
                src={image.files ? image.imgUrl : image.imageurl}
                alt="noimage"
              />
              <span
                className="delete"
                onClick={(e) => {
                  setPostImg(postImg.filter((img, idx) => idx !== i));
                  e.stopPropagation();
                }}
              >
                <X />
              </span>
            </div>
          ))}

          {postImg.length < 5 ? (
            <label htmlFor="post-img">
              <div className="add-button box">
                <input
                  type="file"
                  multiple
                  id="post-img"
                  accept="image/*"
                  onChange={(e) => handleImageCreate(e)}
                />
                <span className="icon">
                  <Plus />
                </span>
              </div>
            </label>
          ) : (
            ""
          )}
        </ImageContainer>
        <CheckBoxContainer>
          <div className="title">책 상태</div>
          <div className="content">
            <div className="container">
              <div className="text">낙서가 있나요?</div>
              <div
                className="icon"
                onClick={() => {
                  const newState = [...checkedList];
                  newState[0] = !newState[0];
                  setCheckedList(newState);
                }}
              >
                <Square />
                {checkedList[0] && (
                  <span className="check">
                    <Check />
                  </span>
                )}
              </div>
            </div>
            <div className="container">
              <div className="text">찢어짐이 있나요?</div>
              <div
                className="icon"
                onClick={() => {
                  const newState = [...checkedList];
                  newState[1] = !newState[1];
                  setCheckedList(newState);
                }}
              >
                <Square />
                {checkedList[1] && (
                  <span className="check">
                    <Check />
                  </span>
                )}
              </div>
            </div>
            <div className="container">
              <div className="text">변색이 있나요?</div>
              <div
                className="icon"
                onClick={() => {
                  const newState = [...checkedList];
                  newState[2] = !newState[2];
                  setCheckedList(newState);
                }}
              >
                <Square />
                {checkedList[2] && (
                  <span className="check">
                    <Check />
                  </span>
                )}
              </div>
            </div>
            <div className="container">
              <div className="text">오염이 있나요?</div>
              <div
                className="icon"
                onClick={() => {
                  const newState = [...checkedList];
                  newState[3] = !newState[3];
                  setCheckedList(newState);
                }}
              >
                <Square />
                {checkedList[3] && (
                  <span className="check">
                    <Check />
                  </span>
                )}
              </div>
            </div>
          </div>
        </CheckBoxContainer>
        <QualityContainer>
          <div className="title">나의 책 등급</div>
          <div className="quality-container">
            <div className={`round-box ${quality === "상" ? "selected" : ""}`}>
              상
            </div>
            <div className={`round-box ${quality === "중" ? "selected" : ""}`}>
              중
            </div>
            <div className={`round-box ${quality === "하" ? "selected" : ""}`}>
              하
            </div>
          </div>
        </QualityContainer>
        <TextContainer>
          <div className="price-container">
            <div className="title">가격</div>
            <input
              type="text"
              placeholder="가격"
              value={`${priceToString(dealPrice.value)} 원`}
              readOnly
            />
          </div>
          <input
            type="text"
            placeholder="글 제목"
            value={dealTitle.value}
            onChange={dealTitle.onChange}
          />
          <textarea
            type="text"
            placeholder="책을 판매하게된 이유 또는 책에 대한 리뷰를 작성해주세요."
            value={dealContent.value}
            onChange={dealContent.onChange}
          />
        </TextContainer>
      </Wrapper>
      <FooterButton
        value={isUpdatePage() ? "완료" : "등록"}
        onClick={createDeal}
      />
    </>
  );
}
