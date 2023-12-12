import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";
import Checkbox from "@mui/material/Checkbox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
} from "@mui/material";
import ScaleText from "react-scale-text";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function App() {
  const [bingoBoxes, setBingoBoxes] = useState([]);
  const emptyImage = "";
  const [openImages, setOpenImages] = React.useState(false);
  const [openText, setOpenText] = React.useState(false);
  const [openNumbers, setOpenNumbers] = React.useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentText, setCurrentText] = useState([]);
  const [inputText, setInputText] = useState("");
  const [currentNumbers, setCurrentNumbers] = useState([]);
  const [bingoSize, setBingoSize] = useState(5);
  const [preventDuplicates, setPreventDuplicates] = useState(false);
  const [includeFreeSpace, setIncludeFreeSpace] = useState(false);
  const canIncludeFreeSpace = bingoSize % 2 === 1;
  const canPreventDuplicates = bingoSize * bingoSize <= bingoBoxes.length;

  useEffect(() => {
    if (!canPreventDuplicates) {
      setPreventDuplicates(false);
    }
  }, [canPreventDuplicates]);

  const handleInput = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) =>
      file.name.match(/\.(jpg|jpeg|png|gif)$/i)
    ).length;

    if (validFiles) {
      setCurrentImages(
        files
          .filter((file) => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
          .map((file) => ({
            url: URL.createObjectURL(file),
            selected: true,
          }))
      );
      handleOpenImages();
    }
  };

  const handleOpenImages = () => {
    setOpenImages(true);
  };
  const handleCloseImages = () => {
    setOpenImages(false);
    setCurrentImages([]);
  };
  const handleOpenText = () => {
    setOpenText(true);
  };
  const handleCloseText = () => {
    setOpenText(false);
    setCurrentText([]);
  };
  const handleAddImages = () => {
    setBingoBoxes(
      [...bingoBoxes].concat(
        currentImages
          .filter((currentImage) => currentImage.selected === true)
          .map((currentImage) => (
            <div
              className="imageBox"
              style={{ backgroundImage: `url(${currentImage.url})` }}
            ></div>
          ))
      )
    );
    handleCloseImages();
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEnterText();
    }
  };
  const handleEnterText = () => {
    if (inputText !== "") {
      setCurrentText((prevText) => [...prevText].concat(inputText));
      setInputText("");
    }
  };
  const handleAddText = () => {
    setBingoBoxes([
      ...bingoBoxes.concat(
        currentText.map((text) => (
          <div className="textParent">
            <ScaleText>
              <div className="textBox">{text}</div>
            </ScaleText>
          </div>
        ))
      ),
    ]);
    handleCloseText();
  };
  const handleDeleteOption = (index) => {
    setBingoBoxes(bingoBoxes.filter((option, idx) => idx !== index));
  };

  return (
    <div className="App">
      <h1>Bingo Maker</h1>
      <p>
        A website for creating Bingo Cards with custom images, text, or numbers.
      </p>
      <h2>Add Boxes:</h2>
      <div className="rowSection">
        <label className="add" htmlFor="addImages">
          Add Images
        </label>
        <input
          id="addImages"
          type="file"
          name="myImage"
          accept="image/*"
          value={emptyImage}
          onInput={handleInput}
          multiple
        />
        <button className="add" onClick={handleOpenText}>
          Add Text
        </button>
        <button className="add">Add Numbers</button>
      </div>
      <h2>Bingo Boxes:</h2>
      <div className="rowSection">
        {bingoBoxes.length > 0 ? (
          bingoBoxes.map((key, index) => (
            <div className="bingoBox" key={index}>
              <div className="bingoBoxInfo">
                <h2>{index + 1}.</h2>
                <IconButton
                  className="deleteButton"
                  onClick={() => handleDeleteOption(index)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </div>
              <div className="bingoBoxContent">{key}</div>
            </div>
          ))
        ) : (
          <p>None</p>
        )}
      </div>
      <h2>Bingo Options:</h2>
      <div className="rowSection">
        <FormControl>
          <InputLabel id="size-select-label">Size</InputLabel>
          <Select
            labelid="size-select-label"
            value={bingoSize}
            label="Size"
            onChange={(event) => setBingoSize(event.target.value)}
          >
            <MenuItem value={3}>3x3</MenuItem>
            <MenuItem value={4}>4x4</MenuItem>
            <MenuItem value={5}>5x5</MenuItem>
            <MenuItem value={6}>6x6</MenuItem>
            <MenuItem value={7}>7x7</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FormControlLabel
            labelPlacement="top"
            label="Include Free Space"
            control={
              <Checkbox
                disabled={!canPreventDuplicates}
                labelid="distribute-evenly-label"
                value={preventDuplicates ? "on" : "off"}
                onChange={(event) => setPreventDuplicates((prev) => !prev)}
              />
            }
          />
        </FormControl>
      </div>
      <BootstrapDialog
        fullWidth
        maxWidth="lg"
        aria-labelledby="customized-dialog-title"
        open={openImages}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add Images?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseImages}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="images">
            {currentImages.map((currentImage) => (
              <div className="image" key={currentImage.url}>
                <div
                  className="crop"
                  style={{ backgroundImage: `url(${currentImage.url})` }}
                ></div>
                <Checkbox
                  checked={currentImage.selected}
                  onChange={() => {
                    setCurrentImages(
                      currentImages.map((image) => {
                        if (image.url === currentImage.url) {
                          return { ...image, selected: !image.selected };
                        } else {
                          return { ...image };
                        }
                      })
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleAddImages}>
            Add Selected
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        fullWidth
        maxWidth="lg"
        aria-labelledby="customized-dialog-title"
        open={openText}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add Text
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseText}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <input
            type="text"
            onKeyDown={handleKeyDown}
            value={inputText}
            onInput={(event) => setInputText(event.target.value)}
          />
          <button onClick={handleEnterText}>Add Text</button>
          <div className="currentText">
            {currentText.length > 0 ? (
              currentText.map((current, index) => (
                <div className="currentTextBox" key={current + index}>
                  <ScaleText>
                    <div className="scaleText">{current}</div>
                  </ScaleText>
                </div>
              ))
            ) : (
              <p>No Text Added</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleAddText}>
            Add Selected
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default App;
