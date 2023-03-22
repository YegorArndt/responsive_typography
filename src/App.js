import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// #region styles
const AppDiv = styled.div`
  font-family: "Open Sans", sans-serif;
  color: #ffffff;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  height: 90vh;
`;

const Input = styled.input.attrs({ type: "number" })`
  width: 50px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Label = styled.label`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Unit = styled.span`
  margin-left: 8px;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify || "center"};
`;

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputAndUnit = styled.div``;

const ResultBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px;
  margin: 16px 0 0 0;
  border: 1px solid #4b4d68;
  border-radius: 5px;
`;

const Result = styled.h1`
  font-size: 1rem;
`;

const CopyBtn = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  margin-left: 2rem;
  color: #ffffff;
  font-size: 1rem;
  background: #4b4d68;
`;

const AppContext = React.createContext({});

const Group = ({ groupName, group }) => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(3.5);
  const { clampFunc } = useContext(AppContext);

  return (
    <Flex direction="column" align="flex-start">
      <h1 style={{ marginTop: "5rem" }}>{groupName}</h1>

      <Flex>
        <LabelGroup>
          {group.map(({ htmlFor, labelText }) => (
            <Label key={htmlFor} htmlFor={htmlFor}>
              {labelText}
            </Label>
          ))}
        </LabelGroup>

        <InputGroup>
          {group.map(({ htmlFor, value, onChange }, i) => (
            <InputAndUnit key={i}>
              <Input
                id={htmlFor}
                value={value || (i === 0 ? min : max)}
                onChange={
                  onChange ||
                  (i === 0
                    ? (e) => setMin(Number(e.target.value))
                    : (e) => setMax(Number(e.target.value)))
                }
              />
              <Unit>px</Unit>
            </InputAndUnit>
          ))}
        </InputGroup>
      </Flex>

      {clampFunc && (
        <ResultBox>
          <Result>{clampFunc(min, max)}</Result>
          <CopyBtn
            onClick={() => {
              const t = document.createElement("textarea");
              t.value = clampFunc(min, max);
              document.body.appendChild(t);
              t.select();
              document.execCommand("copy");
              document.body.removeChild(t);
              toast("Copied to clipboard!");
            }}
          >
            Copy
          </CopyBtn>
        </ResultBox>
      )}
    </Flex>
  );
};

const App = () => {
  const [pixelsPerRem, setPixelsPerRem] = useState(16);
  const [minWidthPx, setMinWidthPx] = useState(360);
  const [maxWidthPx, setMaxWidthPx] = useState(840);

  const minWidth = minWidthPx / pixelsPerRem;
  const maxWidth = maxWidthPx / pixelsPerRem;

  const slope = (min, max) => (max - min) / (maxWidth - minWidth);
  const yAxisIntersection = (min, max) => -minWidth * slope(min, max) + min;

  const clampFunc = (min, max) =>
    `clamp(${min}rem, ${yAxisIntersection(min, max).toFixed(4)}rem + ${(
      slope(min, max) * 100
    ).toFixed(4)}vw, ${max}rem)`;

  return (
    <AppDiv>
      <Group
        groupName="Required settings"
        group={[
          {
            htmlFor: "pixelsPerRem",
            labelText: "Pixes / rem ratio",
            value: pixelsPerRem,
            onChange: (e) => setPixelsPerRem(Number(e.target.value)),
          },
          {
            htmlFor: "minWidthPx",
            labelText: "Minimum screen width =",
            value: minWidthPx,
            onChange: (e) => setMinWidthPx(Number(e.target.value)),
          },
          {
            htmlFor: "maxWidthPx",
            labelText: "Maximum screen width =",
            value: maxWidthPx,
            onChange: (e) => setMaxWidthPx(Number(e.target.value)),
          },
        ]}
      />

      <AppContext.Provider value={{ clampFunc }}>
        {[
          {
            groupName: "Responsive font size",
            onlyLabels: [
              { htmlFor: "minFs", labelText: "Minimum font size =" },
              { htmlFor: "maxFs", labelText: "Maximum font size =" },
            ],
          },
          {
            groupName: "Responsive line height",
            onlyLabels: [
              { htmlFor: "minLh", labelText: "Minimum line height =" },
              { htmlFor: "maxLh", labelText: "Maximum line height =" },
            ],
          },
        ].map(({ groupName, onlyLabels }) => (
          <Group key={groupName} groupName={groupName} group={onlyLabels} />
        ))}
      </AppContext.Provider>

      <ToastContainer />
    </AppDiv>
  );
};

export default App;
