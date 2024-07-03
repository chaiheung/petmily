import React, { useContext, useState } from "react";
import { Box, Button, Text, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../../../../component/LoginProvider.jsx";
import { generateDiaryId } from "../../../../../util/util.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

export function DiaryCommentWrite({ onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [diaryComment, setDiaryComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { memberInfo } = useContext(LoginContext);
  const nickname = memberInfo.nickname;
  const { id } = useParams();
  console.log(id);
  //diaryId가 유효한지 확인
  const diaryId = generateDiaryId(memberInfo.id);

  const handleDiaryCommentSubmitClick = () => {
    setLoading(true);
    axios
      .post("/api/diaryComment/add", {
        diaryId,
        id,
        nickname,
        memberId: memberInfo.id,
        comment,
      })
      .then((res) => {
        toast({
          status: "success",
          position: "top",
          description: "방명록이 등록되었습니다.",
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
