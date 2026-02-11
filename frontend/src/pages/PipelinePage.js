import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
} from '@chakra-ui/react';

function PipelinePage() {
  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.lg">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Manage the Pipeline
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              Track and manage your job applications and opportunities
            </Text>
          </VStack>

          <Card bg="white" w="full" borderRadius="lg" boxShadow="lg">
            <CardBody>
              <Text color="gray.600" textAlign="center" py={8}>
                Pipeline management features coming soon...
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

export default PipelinePage;
