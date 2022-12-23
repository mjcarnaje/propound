import { Box, Text } from "native-base";
import React, { useMemo } from "react";

const QuoteOfTheDay: React.FC = () => {
  const quotes = [
    {
      quote: "The best way to predict the future is to create it.",
      author: "Abraham Lincoln",
    },
    {
      quote: "Failure is the condiment that gives success its flavor.",
      author: "Truman Capote",
    },
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      quote:
        "If you are working on something that you really care about, you don’t have to be pushed. The vision pulls you.",
      author: "Steve Jobs",
    },
    {
      quote:
        "If you are working on something exciting that you really care about, you don’t have to be pushed. The vision pulls you.",
      author: "Steve Jobs",
    },
  ];

  const randomQuote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  return (
    <Box p={4} bg="#4B5563" borderRadius="lg">
      <Text fontSize={18} fontFamily="Inter-SemiBold" color="white">
        {`“${randomQuote.quote}”`}
      </Text>
      <Text
        mt={1}
        fontFamily="Inter-Medium"
        fontSize={13}
        color="white"
        textAlign="right"
      >
        {`- ${randomQuote.author}`}
      </Text>
    </Box>
  );
};

export default QuoteOfTheDay;
