import styled from "@emotion/styled";
import { useSelectionContext } from "@context/ImageAreaSelectorProvider";
import { Selection } from "@type/ImageAreaSelectorType";

const Wrapper = styled.div`
  display: flex;
  width: 548px;
  height: 703px;
  margin-left: 135px;
  background-color: #2a3948;
  color: #fff;
`;

function DataPreview() {
  const { selections, imgBoundary, imgIntrinsicSize } = useSelectionContext();

  const formattData = selections.map((selection: Selection) => {
    return {
      x: Math.round((selection.x / imgBoundary.width) * imgIntrinsicSize.width),
      y: Math.round(
        (selection.y / imgBoundary.height) * imgIntrinsicSize.height,
      ),
      width: Math.round(
        (selection.width / imgBoundary.width) * imgIntrinsicSize.width,
      ),
      height: Math.round(
        (selection.height / imgBoundary.height) * imgIntrinsicSize.height,
      ),
    };
  });

  return (
    <Wrapper>
      <pre>{JSON.stringify(formattData, null, 2)}</pre>
    </Wrapper>
  );
}

export default DataPreview;
