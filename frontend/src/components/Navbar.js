import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Link,
  Container,
} from '@chakra-ui/react';

function Navbar() {
  return (
    <Box
      bg="linear-gradient(135deg, #2D3748 0%, #1A202C 100%)"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" py={4} px={5}>
          <Link
            as={RouterLink}
            to="/"
            fontSize="1.5em"
            fontWeight="700"
            color="white"
            _hover={{ opacity: 0.8, textDecoration: 'none' }}
          >
            My Next Job
          </Link>
          <Flex gap={{ base: 2, md: 8 }} align="center" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
            <Link
              as={RouterLink}
              to="/skills"
              color="white"
              fontWeight="500"
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ opacity: 0.8, textDecoration: 'none' }}
            >
              1. Skills & Experience
            </Link>
            <Link
              as={RouterLink}
              to="/opportunities"
              color="white"
              fontWeight="500"
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ opacity: 0.8, textDecoration: 'none' }}
            >
              2. Find Opportunities
            </Link>
            <Link
              as={RouterLink}
              to="/pipeline"
              color="white"
              fontWeight="500"
              fontSize={{ base: 'sm', md: 'md' }}
              _hover={{ opacity: 0.8, textDecoration: 'none' }}
            >
              3. Manage Pipeline
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;
