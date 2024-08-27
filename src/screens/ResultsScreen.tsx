import React from "react";
import { Layout } from "../components/Layout";
import { VStack, Heading, Text, Box, Button, Divider } from "native-base";
import { MainRouterParams } from "../routers/MainRouter";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Hyperlink } from "react-native-hyperlink";

export type ResultsScreenProps = {
  result: (string | number)[];
};

export const ResultsScreen = ({ route }) => {
  /***************		HOOKS		***************/

  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainRouterParams>>();
  const { result } = route.params;

  /***************		JSX		***************/

  return (
    <Layout>
      <VStack space={8} alignItems="center" justifyContent="center">
        <Heading padding={2} textAlign="center">
          {route?.params?.result[0]}
        </Heading>
        {result[1] != null && <Text>Your score: {result[1]}</Text>}
        <Box
          p="3.5"
          bg="yellow.100"
          alignItems="center"
          borderRadius={30}
          justifyContent="center"
        >
          {result[2] != null && <Text textAlign="center">{result[2]}</Text>}
          <Divider my={3} />
          <Hyperlink
            linkDefault={true}
            linkStyle={{ color: "#2980b9" }}
            linkText={(url) => (url === result[3] ? "Click here" : url)}
          >
            <Text textAlign={"center"}>
              {result[3]} to view scoring information for this screening tool.
            </Text>
          </Hyperlink>
          <Hyperlink
            linkDefault={true}
            linkStyle={{ color: "#2980b9" }}
            linkText={(url) => (url === result[4] ? "Click here" : url)}
          >
            <Text textAlign={"center"}>
              {result[4]} to view comprehensive information and treatment
              options for this disorder.
            </Text>
          </Hyperlink>
        </Box>
        <Box padding={2} alignItems="center">
          <Text>
            Disclaimer: The PEACE for Moms mobile application does NOT save your
            screening results. Please screenshot this screen for your records if
            you would like to keep the results.
          </Text>
        </Box>
        <Button onPress={() => navigate("TabRouter", { screen: "Home" })}>
          Go to home
        </Button>
      </VStack>
    </Layout>
  );
};
