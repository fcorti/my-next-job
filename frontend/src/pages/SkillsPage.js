import React from 'react';
import { Box, Container, Heading, Text, VStack, Card, CardBody } from '@chakra-ui/react';

function SkillsPage() {
  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.sm">
        <Card bg="white" borderRadius="lg" boxShadow="lg">
          <CardBody textAlign="center" py={12}>
            <VStack spacing={6}>
              <Heading as="h1" size="xl" color="gray.800">
                Skills & Experience
              </Heading>
              <Text fontSize="lg" color="gray.600">
                This section is coming soon. You'll be able to document and showcase your professional skills and work experience here.
              </Text>
              <Box
                p={8}
                border="2px dashed"
                borderColor="purple.300"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontSize="lg" color="gray.400">
                  📋 Your skills and experience section
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default SkillsPage;
