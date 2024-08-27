import {
  Card,
  Heading,
  VStack,
  FormControl,
  View,
  Image,
  Text,
  Button,
} from "native-base";
import "firebase/database";
import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { logOut } from "../store/slices/AuthSlice";
import { Layout } from "../components/Layout";
import { database } from "../firebase/config";
import { ref, get } from "firebase/database";
import { useAppDispatch, useAppSelector } from "../store";
import { Profile } from "../types/Profile";

export const ProfileScreen = () => {
  /***************		HOOKS		***************/

  const image = require("../images/p4m-profile.png");

  const [profile, setProfile] = useState<Profile>({
    email: "",
    name: "",
    phone_number: "",
  });
  const uid = useAppSelector((state) => state.Auth.user).uid;
  const reference = ref(database, `/users/${uid}`);
  const dispatch = useAppDispatch();

  if (profile.email === "") {
    get(reference).then((snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      }
    });
  }

  /***************		JSX		***************/

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Layout>
        <FormControl isRequired>
          <VStack space={5} paddingTop={10}>
            <Heading textAlign="center">Profile Information</Heading>
            <Card style={{ borderRadius: 9, backgroundColor: "#FBF4BB" }}>
              <Text>Name: {profile.name}</Text>
            </Card>
            <Card style={{ borderRadius: 9, backgroundColor: "#FBF4BB" }}>
              <Text>Phone Number: {profile.phone_number}</Text>
            </Card>
            <View>
              <Card style={{ borderRadius: 9, backgroundColor: "#FBF4BB" }}>
                <Text>Email: {profile.email}</Text>
              </Card>
            </View>
            <Button onPress={() => dispatch(logOut())}>Log out</Button>
            <VStack space={2}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 3 }}></View>
              </View>
            </VStack>
          </VStack>
        </FormControl>
        <Image
          alignSelf="center"
          source={image}
          resizeMode="contain"
          alt="P4M profile"
        />
      </Layout>
    </TouchableWithoutFeedback>
  );
};
