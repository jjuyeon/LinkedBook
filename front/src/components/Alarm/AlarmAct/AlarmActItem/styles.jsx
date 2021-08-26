import styled from "styled-components";
import { fonts, colors } from "../../../../styles";
export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: ${fonts.lg};
  .created-at {
    font-size: 12px;
    color: ${colors.gray};
    margin-left: 1rem;
  }
`;

export const Content = styled.div`
  width: 70%;
  .icon {
    font-size: ${fonts.lg};
    color: ${colors.yellow};
  }
`;

export const ItemAndIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  .icon {
    font-size: ${fonts.xl};
    color: ${colors.yellow};
    margin-top: 0.3rem;
  }
`;
