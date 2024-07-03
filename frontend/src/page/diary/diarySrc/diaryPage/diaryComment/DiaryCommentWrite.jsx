import React, { useContext, useState } from "react";
import { Box, Button, Text, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../../../../component/LoginProvider.jsx";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export function DiaryCommentWrite({ onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { memberInfo } = useContext(LoginContext);
  const nickname = memberInfo.nickname;
  const { diaryId } = useParams(); // 수정: diaryId를 useParams로 가져옴

  const handleDiaryCommentSubmitClick = () => {
    setLoading(true);
    axios
      .post("/api/diaryComment/add", {
        diaryId,
        nickname,
        memberId: memberInfo.id,
        comment,
      })
      .then((res) => {
        toast({
          status: "success",
          position: "top",
          description: "방명록이 등록되었습니다.",
          duration: 10000,
        });
        onCommentAdded(res.data); // 새로운 댓글을 추가
        setComment(""); // 입력창 초기화
        window.location.reload(); // 페이지 새로고침
      })
      .catch((e) => {
        toast({
          status: "error",
          position: "top",
          description: "방명록 등록 중 오류가 발생했습니다.",
        });
      })
      .finally(() => setLoading(false));
  };

  let disableSaveButton = comment.trim().length === 0;

  return (
    <Box>
      <Box>
        <Text fontWeight="bold" fontSize="large">
          {nickname}님!
        </Text>
      </Box>
      <Box mb={2}>
        <Textarea
          placeholder="방명록을 남겨보세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Box>
      <Button
        isLoading={loading}
        isDisabled={disableSaveButton}
        colorScheme={"blue"}
        onClick={handleDiaryCommentSubmitClick}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </Button>
    </Box>
  );
}
