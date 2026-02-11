import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  ButtonGroup,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';

function WatchlistPage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    loadActiveRole();
    loadWatchlist();
  }, []);

  const loadActiveRole = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities/active-role`);
      if (!response.ok) {
        throw new Error('Failed to load active role');
      }
      const data = await response.json();
      setActiveRole(data.active_role);
    } catch (err) {
      setError('Failed to load active role: ' + err.message);
    }
  };

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/watchlist`);
      if (!response.ok) {
        throw new Error('Failed to load watchlist');
      }
      const data = await response.json();
      setWatchlist(data);
      setError('');
    } catch (err) {
      setError('Failed to load watchlist: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteCareerPage = async () => {
    if (!deleteConfirm) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/watchlist?url=${encodeURIComponent(deleteConfirm)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete career page');
      }

      setError('');
      setDeleteConfirm(null);
      loadWatchlist();
    } catch (err) {
      setError('Failed to delete career page: ' + err.message);
      setDeleteConfirm(null);
    }
  };

  const handleModify = (url) => {
    navigate(`/opportunities/watchlist/modify/${encodeURIComponent(url)}`);
  };

  const getSortedWatchlist = () => {
    const sorted = [...watchlist].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.url.localeCompare(b.url);
      } else {
        return b.url.localeCompare(a.url);
      }
    });
    return sorted;
  };

  const sortedWatchlist = getSortedWatchlist();

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.lg">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Watchlist
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              Career pages of Companies that you may find interesting
            </Text>
          </VStack>

          {activeRole && (
            <Card bg="gray.50" w="full" borderLeft="4px solid" borderColor="#2D3748">
              <CardBody>
                <Text fontSize="sm" color="gray.600" fontWeight="500">
                  Active Job Role: <Text as="span" fontWeight="700" color="gray.800">{activeRole}</Text>
                </Text>
              </CardBody>
            </Card>
          )}

          {error && (
            <Alert status="error" borderRadius="md" w="full">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Card bg="white" w="full" borderRadius="lg" boxShadow="lg">
            <CardBody>
              <HStack spacing={3} justify="flex-start" mb={4}>
                <Button
                  size="sm"
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => navigate('/opportunities')}
                >
                  Back to Opportunities
                </Button>
                <Button
                  size="sm"
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => navigate('/opportunities/watchlist/add')}
                >
                  Add Career Page
                </Button>
              </HStack>
              {loading ? (
                <Box textAlign="center" py={8}>
                  <Spinner color="gray.600" />
                </Box>
              ) : watchlist.length === 0 ? (
                <Text textAlign="center" color="gray.500" py={8}>
                  No career pages in your watchlist. Add companies you want to monitor.
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Sort by URL:
                    </Text>
                    <ButtonGroup size="sm" isAttached variant="outline">
                      <Button
                        colorScheme="gray"
                        variant={sortOrder === 'asc' ? 'solid' : 'outline'}
                        onClick={() => setSortOrder('asc')}
                        leftIcon={<ArrowUpIcon />}
                      >
                        A-Z
                      </Button>
                      <Button
                        colorScheme="gray"
                        variant={sortOrder === 'desc' ? 'solid' : 'outline'}
                        onClick={() => setSortOrder('desc')}
                        leftIcon={<ArrowDownIcon />}
                      >
                        Z-A
                      </Button>
                    </ButtonGroup>
                  </HStack>
                  <TableContainer>
                  <Table variant="striped" colorScheme="gray">
                    <Thead bg="gray.100">
                      <Tr>
                        <Th>URL</Th>
                        <Th>Last Visit</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sortedWatchlist.map((entry) => (
                        <Tr key={entry.url}>
                          <Td>
                            <Link
                              href={entry.url}
                              isExternal
                              color="blue.600"
                              _hover={{ textDecoration: 'underline' }}
                            >
                              {entry.url}
                            </Link>
                          </Td>
                          <Td color="gray.700">
                            {formatDate(entry.last_visit)}
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                colorScheme="gray"
                                variant="outline"
                                leftIcon={<EditIcon />}
                                onClick={() => handleModify(entry.url)}
                              >
                                Modify
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                leftIcon={<DeleteIcon />}
                                onClick={() => setDeleteConfirm(entry.url)}
                              >
                                Delete
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                </VStack>
              )}
            </CardBody>
          </Card>

          <AlertDialog
            isOpen={deleteConfirm !== null}
            leastDestructiveRef={cancelRef}
            onClose={() => setDeleteConfirm(null)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Career Page
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this career page? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={deleteCareerPage} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>
      </Container>
    </Box>
  );
}

export default WatchlistPage;
