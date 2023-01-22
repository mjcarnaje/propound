import { Box, ScrollView } from "native-base";
import React from "react";
import { Dimensions } from "react-native";

interface BaseScreenProps {
  children: React.ReactNode;
  isScrollable?: boolean;
}

const BaseScreen: React.FC<BaseScreenProps> = ({ children, isScrollable }) => {
  let content = (
    <Box bg="#f9f9fb" flexGrow={1}>
      {children}
    </Box>
  );

  if (isScrollable) {
    content = (
      <ScrollView
        bg="#f9f9fb"
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
      <Box safeAreaTop paddingTop={2} bg="#f9f9fb" />
      {content}
    </>
  );
};

export default BaseScreen;
