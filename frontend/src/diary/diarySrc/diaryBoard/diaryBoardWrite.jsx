import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";

function DiaryBoardWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  function handleSaveClick() {
    axios.post("/api/board/add", {
      title,
      content,
      writer,
    });
  }

  return (
    <Box>
      <Box>방명록</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>방명록 작성</FormLabel>
            <Input onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>글 작성</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input onChange={(e) => setWriter(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <Button colorScheme={"blue"} onClick={handleSaveClick}>
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default DiaryBoardWrite;
