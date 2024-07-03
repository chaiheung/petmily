import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../../../../component/LoginProvider.jsx";
import { DiaryContext } from "../../diaryComponent/DiaryContext.jsx";
import { format } from "date-fns";
import {
  extractUserIdFromDiaryId,
  generateDiaryId,
} from "../../../../../util/util.jsx";
import Pagination from "../../../../../component/Pagination.jsx";

export function DiaryBoardList() {
  const { memberInfo } = useContext(LoginContext);
  const { diaryBoardList, setDiaryBoardList } = useContext(DiaryContext); // DiaryContext 사용
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diaryId = useParams().diaryId;
  const isOwner =
    Number(memberInfo?.id) === Number(extractUserIdFromDiaryId(diaryId));
  const diaryIndex = diaryBoardList.findIndex((item) => item.id === Number(id));
  const diaryNumber = diaryBoardList.length - diaryIndex;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("memberId", extractUserIdFromDiaryId(diaryId));
    axios.get(`/api/diaryBoard/list?${params.toString()}`).then((res) => {
      setDiaryBoardList(res.data.diaryBoardList);
      setPageInfo(res.data.pageInfo);
    });

    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams, diaryId, setDiaryBoardList]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleSearchClick() {
    // 현재 URL의 쿼리 파라미터를 가져옵니다.
    const params = new URLSearchParams(searchParams);

    // 새로운 파라미터를 설정합니다.
    params.set("type", searchType);
    params.set("keyword", searchKeyword);
    params.set("memberId", extractUserIdFromDiaryId(diaryId));

    // 수정된 쿼리 파라미터로 페이지를 이동합니다.
    console.log(params.toString());
    navigate(`?${params.toString()}`);
  }

  function handlePageButtonClick(pageNumber) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber);
    params.set("memberId", extractUserIdFromDiaryId(diaryId));
    navigate(`?${params.toString()}`);
  }

  function handleSelectedDiaryBoard(id) {
    return () => navigate(`/diary/${diaryId}/view/${id}`);
  }

  function handleWriteClick() {
    const diaryId = generateDiaryId(memberInfo.id);
    navigate(`/diary/${diaryId}/write`);
  }

  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Box mb={5}></Box>
      <Center>
        <Heading>다이어리 목록</Heading>
      </Center>
      <Box>{isOwner && <Button onClick={handleWriteClick}>글쓰기</Button>}</Box>
      <Box>
        {diaryBoardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
        {diaryBoardList.length > 0 && (
          <Table>
            <Thead>
              <Tr>
                <Th textAlign="center">N번째 일기</Th>
                <Th textAlign="center">제목</Th>
                <Th textAlign="center">작성일자</Th>
              </Tr>
            </Thead>
            <Tbody>
              {diaryBoardList.map((diaryBoard, index) => (
                <Tr
                  key={diaryBoard.id}
                  _hover={{ bg: hoverBg }}
                  cursor="pointer"
                  onClick={handleSelectedDiaryBoard(
                    diaryBoard.id,
                    diaryBoardList.length - index,
                  )}
                >
                  <Td w="10%" textAlign="center">
                    {diaryNumber}
                  </Td>
                  <Td w="30%" textAlign="center">
                    {diaryBoard.title}
                    {/*{diaryBoard.numberOfImages > 0 && (*/}
                    {/*  <Badge ml={2} colorScheme="teal">*/}
                    {/*    <FontAwesomeIcon icon={faImages} />*/}
                    {/*    {diaryBoard.numberOfImages}*/}
                    {/*  </Badge>*/}
                    {/*)}*/}
                  </Td>
                  {/*<Td w="50%" textAlign="center">*/}
                  {/*  {diaryBoard.content}*/}
                  {/*</Td>*/}
                  <Td w="10%" textAlign="center">
                    {format(new Date(diaryBoard.inserted), "yyyy.MM.dd")}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Pagination
        pageInfo={pageInfo}
        pageNumbers={pageNumbers}
        handlePageButtonClick={handlePageButtonClick}
      />

      <Center mb={10}>
        <Flex gap={2}>
          <Box>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <option value="all">전체</option>
              <option value="text">제목</option>
              <option value="nickname">작성자</option>
            </Select>
          </Box>
          <Box>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            />
          </Box>
          <Box>
            <Button
              onClick={handleSearchClick}
              colorScheme="teal"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Box>
        </Flex>
      </Center>
    </>
  );
}
