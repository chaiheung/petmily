import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled, { css, keyframes } from "styled-components";
import { BoardCommentComponent } from "../../component/board/BoardCommentComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { generateDiaryId } from "../../util/util.jsx";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ReportModal from "./ReportModal";

const beat = keyframes`
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.1);
  }
  40% {
    transform: scale(1);
  }
`;

const HeartIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: ${(props) => (props.liked ? "red" : "inherit")};
  ${(props) =>
    props.liked &&
    css`
      animation: ${beat} 0.3s;
    `}
  cursor: pointer;
`;

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenReport,
    onOpen: onOpenReport,
    onClose: onCloseReport,
  } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { memberInfo } = useContext(LoginContext);
  const memberId = memberInfo && memberInfo.id ? parseInt(memberInfo.id) : null;
  const params = memberId ? { memberId } : {};

  const [selectedWriter, setSelectedWriter] = useState(null);
  const [selectedWriterId, setSelectedWriterId] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/board/${id}`, { params })
      .then((res) => {
        setBoard(res.data.board);
        setLike(res.data.like);
        fetchProfileImage(res.data.board.memberId);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          toast({
            status: "info",
            description: "해당 게시물이 존재하지 않습니다",
            position: "top",
            duration: 500,
          });
        }
      });
  }, [id]);

  async function fetchProfileImage(memberId) {
    try {
      const res = await axios.get(`/api/member/${memberId}`);
      setProfileImage(res.data.imageUrl);
      console.log("Fetched profileImage=", res.data.imageUrl);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  }

  const handleClickRemove = () => {
    axios
      .delete(`/api/board/${board.id}`, { params })
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 삭제되었습니다`,
          position: "top",
          duration: 10,
        });
        navigate(`/`);
      })
      .catch(() => {
        toast({
          status: "error",
          description: "잘못된 삭제 명령입니다",
          position: "top",
          duration: 10,
        });
      })
      .finally(onCloseDelete);
  };

  const handleClickLike = () => {
    if (!memberInfo) {
      return;
    }
    setIsLikeProcessing(true);
    axios
      .put("/api/board/like", { boardId: board.id, memberId: memberInfo.id })
      .then((res) => {
        setLike(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLikeProcessing(false);
      });
  };

  const handleWriterClick = (writer, writerId) => {
    setSelectedWriter(writer);
    setSelectedWriterId(writerId);
  };

  const handleDiaryView = () => {
    const diaryId = generateDiaryId(selectedWriterId);
    const url = `/diary/${diaryId}`;
    const windowFeatures = "width=1531,height=864";
    window.open(url, "_blank", windowFeatures);
  };

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Button
        onClick={() =>
          navigate(
            `/board/list?boardType=${localStorage.getItem("currentBoardType")}`,
          )
        }
      >
        게시판으로 돌아가기
      </Button>
      <Box p={6} borderWidth="1px" borderRadius="md" bg="white" mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Box fontWeight="bold" fontSize="2xl">
            {board.title}
          </Box>
          <Flex align="center">
            <Box fontSize="sm" color="gray.600" mr={2}>
              {new Date(board.inserted).toLocaleString()}
            </Box>
            <Popover>
              <PopoverTrigger>
                <Box display="flex" alignItems="center">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      boxSize="40px"
                      borderRadius="full"
                      mr={2}
                      sx={{ cursor: "pointer" }}
                    />
                  ) : (
                    <Avatar
                      name={board.writer}
                      size="sm"
                      mr={2}
                      sx={{ cursor: "pointer" }}
                    />
                  )}
                  <Badge
                    cursor="pointer"
                    color="blue.600"
                    onClick={() =>
                      handleWriterClick(board.writer, board.memberId)
                    }
                  >
                    {board.writer}
                  </Badge>
                </Box>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Button colorScheme="blue" onClick={handleDiaryView}>
                    작성자 다이어리 보기
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
        <Flex justify="space-between" align="center">
          <Box>추천수: {like.count}</Box>
        </Flex>
      </Box>
      <Box p={6} borderWidth="1px" borderRadius="md" bg="white">
        {board.fileList &&
          board.fileList.map((file) => (
            <Box key={file.name} mb={3}>
              <Image src={file.src} alt={file.name} borderRadius="md" />
            </Box>
          ))}
        {board.content}
      </Box>
      <Flex mt={4} mb={4} align="center">
        <Tooltip isDisabled={memberInfo} hasArrow label="로그인 해주세요.">
          <HeartIcon
            icon={like.like ? fullHeart : emptyHeart}
            liked={like.like}
            onClick={handleClickLike}
          />
        </Tooltip>
        {like.count > 0 && (
          <Box mx={3} fontSize="2xl">
            {like.count}
          </Box>
        )}
        <Spacer />
        <Flex align="center">
          {(memberId === board.memberId || memberId === 1) && (
            <>
              <Button
                colorScheme="purple"
                onClick={() => navigate(`/board/edit/${id}`)}
                mr={2}
              >
                수정
              </Button>
              <Button mr={2} colorScheme="red" onClick={onOpenDelete}>
                삭제
              </Button>
            </>
          )}
          <Button
            display={memberId === board.memberId ? "none" : "block"}
            onClick={() => {
              if (!memberInfo) {
                toast({
                  description: "로그인 해주시길 바랍니다",
                  duration: 5000,
                  position: "top",
                  isClosable: true,
                });
              } else {
                onOpenReport();
              }
            }}
          >
            신고
          </Button>
          {isLikeProcessing && (
            <Box ml={2}>
              <Spinner size="sm" />
            </Box>
          )}
        </Flex>
      </Flex>
      <Box fontSize={"large"} color="gray.500">
        조회수: {board.views}
      </Box>
      <Box mt={4}>
        <BoardCommentComponent boardId={board.id} />
      </Box>

      <DeleteConfirmationModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onClickRemove={handleClickRemove}
      />
      <ReportModal
        isOpen={isOpenReport}
        onClose={onCloseReport}
        boardId={board.id}
        memberId={params.memberId}
      />
    </Container>
  );
}

export default BoardView;
