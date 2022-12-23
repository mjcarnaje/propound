import { Box, ScrollView } from "native-base";
import React from "react";

interface BaseScreenProps {
  children: React.ReactNode;
  isScrollable?: boolean;
}

const BaseScreen: React.FC<BaseScreenProps> = ({ children, isScrollable }) => {
  let content = (
    <Box bg="white" flex={1}>
      {children}
    </Box>
  );

  if (isScrollable) {
    content = (
      <ScrollView
        bg="white"
        flex={1}
        contentContainerStyle={{ paddingBottom: 24 }}
        nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <>
      <Box safeAreaTop bg="white" />
      {content}
    </>
  );
};

export default BaseScreen;
