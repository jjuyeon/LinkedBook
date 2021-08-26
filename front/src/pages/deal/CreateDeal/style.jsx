import styled from "styled-components";
import { colors, fonts } from "../../../styles";

export const Wrapper = styled.div`
  margin: 0 0 60px 0;
  padding: 15px 24px;
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
  .input-container {
    flex: 9;
    position: relative;
    display: flex;
    align-items: center;

    .search-list {
      background-color: ${colors.lightGray};
      display: flex;
      flex-direction: column;
      padding: 20px;
      max-height: 330px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      width: 100%;
      top: 39px;
      gap: 16px;
      z-index: 99;
      border-radius: 6px;
    }
    input {
      width: 100%;
      height: 45px;
      padding: 0 40px 0 16px;
      outline: none;
      border: none;
      background-color: ${colors.lightGray};
      border-radius: 6px;
    }
    .search-icon {
      font-size: 18px;
      position: absolute;
      right: 10px;
    }
  }
  .barcode-icon {
    flex: 1;
    font-size: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const BookInfo = styled.div`
  width: 100%;
  display: flex;
  gap: 6px;
  flex-direction: column;
  .title {
    font-size: ${fonts.md};
  }
  .author-publisher {
    font-size: ${fonts.xs};
    color: ${colors.gray};
  }
`;

export const ImageContainer = styled.div`
  margin-top: 32px;
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 2px;
  border-radius: 6px;
  -webkit-overflow-scrolling: touch;
  .box {
    display: inline-block;
    border-radius: 6px;
    width: 80px;
    height: 80px;
    background-color: ${colors.lightGray};
    margin-right: 18px;
    position: relative;
    &:last-child {
      margin-right: 0;
    }
  }
  .image {
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: cover;
    }
    .delete {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      right: 5px;
      font-size: ${fonts.xl};
    }
  }
  .add-button {
    position: relative;
    input {
      display: none;
    }
    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
    }
  }
`;

export const CheckBoxContainer = styled.div`
  margin-top: 30px;
  .title {
    font-size: ${fonts.md};
    margin-bottom: 10px;
  }
  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .container {
      display: flex;
      width: 40%;
      justify-content: space-between;
      margin: 5px 0;
      .text {
        font-size: ${fonts.sm};
      }
      .icon {
        font-size: ${fonts.lg};
        position: relative;
        color: ${colors.gray};
        .check {
          color: ${colors.yellow};
          font-size: 24px;
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-15%, -15%);
        }
      }
    }
  }
`;

export const QualityContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 32px;
  justify-content: space-between;
  .title {
    font-size: ${fonts.md};
    flex: 4;
  }
  .quality-container {
    display: flex;
    justify-content: space-between;
    flex: 6;
    .round-box {
      cursor: pointer;
      height: 22px;
      width: 26%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100px;
      border: 1px solid ${colors.gray};
      color: ${colors.gray};
      transition: all 0.2s;
      &.selected {
        background-color: ${colors.yellow};
        border: none;
        color: ${colors.white};
      }
    }
  }
`;

export const TextContainer = styled.div`
  margin-top: 20px;
  .price-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .title {
      font-size: ${fonts.md};
      display: flex;
      align-items: center;
    }
    input {
      width: 80%;
      margin-bottom: 0;
      text-align: end;
      padding: 0 16px 0 16px;
      background-color: white;
    }
  }
  input {
    width: 100%;
    height: 45px;
    padding: 0 40px 0 16px;
    outline: none;
    border: none;
    background-color: ${colors.lightGray};
    border-radius: 6px;
    margin-bottom: 20px;
  }

  textarea {
    width: 100%;
    height: 150px;
    padding: 16px;
    outline: none;
    border: none;
    background-color: ${colors.lightGray};
    border-radius: 6px;
    resize: none;
  }
`;
