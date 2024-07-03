import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../../../../component/LoginProvider.jsx";
import { generateDiaryId } from "../../../../../util/util.jsx";

export function DiaryCommentEdit() {
  const { id } = useParams();
  const [diaryComment, setDiaryComment] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { memberInfo } = useContext(LoginContext);
  const access = memberInfo.access;
  const nickname = memberInfo.nickname;
  const isLoggedIn = Boolean(access);
  const navigate = useNavigate();
  const diaryId = generateDiaryId(memberInfo.id);

  useEffect(() => {
    axios
      .get(`/api/diaryComment/${id}`)
      .then((res) => setDiaryComment(res.data))
      .catch((err) => {
        toast({
          status: "error",
          description: "댓글을 불러오는 중 오류가 발생했습니다.",
          position: "top",
        });
      });
  }, [id, toast, navigate]);

  function handleCommentSubmit() {
    if (!diaryComment) return;

    axios
      .put(`/api/diaryComment/edit`, {
        id: diaryComment.id, // 수정할 댓글의 ID 사용
        nickname: memberInfo.nickname,
        comment: diaryComment.comment,
        memberId: memberInfo.id,
      })
      .then(() => {
        toast({
          status: "success",
          description: "댓글이 수정되었습니다.",
          position: "top",
        });
        navigate(`/diary/${diaryId}/comment/view/${id}`);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          toast({
            status: "error",
            description: "댓글이 수정되지 않았습니다.",
            position: "top",
          });
        }
      })
      .finally(() => {
        onClose();
      });
  }

  if (diaryComment === null) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={5}
      boxShadow="md"
      borderRadius="md"
      bg="white"
    >
      <Box mb={10}>
        <Text fontSize="xl" fontWeight="bold">
          방명록 수정
        </Text>
      </Box>
      <Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={memberInfo.nickname} readOnly />
          </FormControl>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>방명록 작성글</FormLabel>
            <Textarea
              value={diaryComment.comment}
              key={diaryComment.id}
              onChange={(e) =>
                setDiaryComment({ ...diaryComment, comment: e.target.value })
              }
            ></Textarea>
            <Button onClick={onOpen} mt={4}>
              저장
            </Button>
          </FormControl>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>확인</ModalHeader>
            <ModalBody>저장하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={handleCommentSubmit} colorScheme="blue">
                확인
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
