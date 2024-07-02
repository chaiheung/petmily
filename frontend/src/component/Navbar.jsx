import {
  Box,
  Button,
  Flex,
  Img,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateDiaryId } from "../util/util.jsx";
import BoardMenu from "./BoardMenu.jsx";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const { memberInfo, setMemberInfo } = useContext(LoginContext);
  const access = memberInfo?.access || null;
  const nickname = memberInfo?.nickname || null;
  const isLoggedIn = Boolean(access);
  const diaryId = isLoggedIn ? generateDiaryId(memberInfo.id) : null;
  const handleMouseEnter = () => {
    onOpen();
  };

  const handleMouseLeave = () => {
    onClose();
  };
  function handleSearchClick() {
    const searchParams = new URLSearchParams();
    searchParams.append("keyword", searchQuery);
    navigate(`board/list?${searchParams.toString()}`);
  }

  const handleLogout = async () => {
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      const response = await axios.post("/api/member/logout", formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setMemberInfo(null);
        localStorage.removeItem("memberInfo");
        navigate("/member/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleOpenDiary = () => {
    const url = `/diary/${diaryId}`;
    const windowFeatures = "width=1531,height=864,max-width=800,max-height=600";
    window.open(url, "_blank", windowFeatures);
  };

  useEffect(() => {
    // 페이지 내용이 Navbar 밑에서부터 시작하도록 body 패딩 설정
    document.body.style.paddingTop = isLargerThan768 ? "100px" : "120px";
    return () => {
      document.body.style.paddingTop = "0";
    };
  }, [isLargerThan768]);

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      minHeight={{ base: "120px", md: "100px" }}
      alignItems="center"
      justifyContent="space-between"
      px={5}
      py={{ base: 2, md: 0 }}
      bg="#F8F8FF"
      boxShadow="md"
      wrap="wrap"
    >
      <Flex alignItems="center" gap={5} wrap="wrap">
        <Box
          _hover={{ cursor: "pointer" }}
          p={2}
          borderRadius="md"
          onClick={() => navigate("/")}
          w="150px"
        >
          <Img src={"/img/petmily-logo.png"} w="100%" h="auto" />
        </Box>
        <BoardMenu isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        {isLargerThan768 && (
          <>
            <Box
              _hover={{ cursor: "pointer", bgColor: "gray.200" }}
              p={2}
              borderRadius="md"
              fontSize="md"
              fontWeight="medium"
              onClick={() => navigate("/place/map")}
            >
              동물병원 찾기
            </Box>
            <Box
              _hover={{ cursor: "pointer", bgColor: "gray.200" }}
              p={2}
              borderRadius="md"
              fontSize="md"
              fontWeight="medium"
              onClick={() => navigate("/board/list?boardType=반려동물 정보")}
            >
              반려인 가이드
            </Box>
            <Box
              _hover={{ cursor: "pointer", bgColor: "gray.200" }}
              p={2}
              borderRadius="md"
              fontSize="md"
              fontWeight="medium"
              onClick={() => navigate("/aichat")}
            >
              닥터 AI
            </Box>
          </>
        )}
      </Flex>
      <Flex gap={5} alignItems="center" wrap="wrap">
        {isLargerThan768 ? (
          <>
            <Button
              bgColor="purple.100"
              _hover={{ bgColor: "purple.200" }}
              fontSize="md"
              fontWeight="medium"
            >
              새 글쓰기
            </Button>
            <Flex>
              <Input
                type="text"
                placeholder="통합 검색"
                borderRadius="md"
                borderColor="gray.300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchClick();
                  }
                }}
              />
              <Button
                bgColor="purple.100"
                _hover={{ bgColor: "purple.200" }}
                ml={2}
                onClick={handleSearchClick}
              >
                검색
              </Button>
            </Flex>
            {isLoggedIn ? (
              <>
                <Box
                  _hover={{ cursor: "pointer", bgColor: "gray.200" }}
                  p={2}
                  borderRadius="md"
                  fontSize="md"
                  fontWeight="medium"
                  onClick={() => navigate(`/member/page/${memberInfo.id}`)}
                >
                  {nickname}님
                </Box>
                <Box
                  _hover={{ cursor: "pointer", bgColor: "gray.200" }}
                  p={2}
                  borderRadius="md"
                  fontSize="md"
                  fontWeight="medium"
                  onClick={handleOpenDiary}
                >
                  다이어리
                </Box>
                <Button
                  bgColor="purple.100"
                  _hover={{ cursor: "pointer", bgColor: "purple.200" }}
                  p={2}
                  borderRadius="md"
                  fontSize="md"
                  fontWeight="medium"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                bgColor="purple.100"
                _hover={{ cursor: "pointer", bgColor: "purple.200" }}
                p={2}
                borderRadius="md"
                fontSize="md"
                fontWeight="medium"
                onClick={() => navigate("/member/login")}
              >
                로그인
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              bgColor="purple.100"
              _hover={{ bgColor: "purple.200" }}
              fontSize="md"
              fontWeight="medium"
              onClick={() => navigate("/board/write")}
            >
              <FontAwesomeIcon icon={faPencil} />
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                fontSize="md"
                fontWeight="medium"
              >
                메뉴
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate("/")}>홈</MenuItem>
                <MenuItem onClick={() => navigate("/place/map")}>
                  동물병원 찾기
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate("/board/list?boardType=반려동물 정보")
                  }
                >
                  반려동물 정보
                </MenuItem>
                <MenuItem onClick={() => navigate("/aichat")}>
                  AI 수의사
                </MenuItem>
                {isLoggedIn ? (
                  <>
                    <MenuItem
                      onClick={() => navigate(`/member/page/${memberInfo.id}`)}
                    >
                      {nickname}님
                    </MenuItem>
                    <MenuItem onClick={handleOpenDiary}>다이어리</MenuItem>
                    <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={() => navigate("/member/login")}>
                    로그인
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </>
        )}
      </Flex>
    </Flex>
  );
}
