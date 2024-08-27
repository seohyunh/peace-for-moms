import React, { useRef, useState } from "react";
import { Layout } from "../components/Layout";
import {
  Button,
  Card,
  Image,
  Input,
  Text,
  VStack,
  HStack,
  KeyboardAvoidingView,
  Link,
  Heading,
} from "native-base";
import { auth, database } from "../firebase/config";
import { Platform, TextInput } from "react-native";
import { useAppDispatch } from "../store";
import { setAuthState } from "../store/slices/AuthSlice";
import {
  EmailAuthCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { CheckBox } from "../components/Checkbox";
import { ref, set } from "firebase/database";
import { Profile } from "../types/Profile";

export function RegisterScreen() {
  /***************		HOOKS		***************/

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licensed, setlicensed] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const image = require("../images/p4m_logo.png");

  const passwordInputRef = useRef<TextInput>();
  const confirmPasswordInputRef = useRef<TextInput>();
  const nameInputRef = useRef<TextInput>();
  const phoneInputRef = useRef<TextInput>();
  const emailInputRef = useRef<TextInput>();

  const dispatch = useAppDispatch();

  /***************		FUNCTIONS		***************/

  const handleEmailChange = (newEmail) => {
    setEmail(newEmail);
    setErrorCode("");
  };

  const handleNameChange = (newName) => {
    setName(newName);
    setErrorCode("");
  };

  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
    setErrorCode("");
  };

  const handleSignUp = () => {
    if (!licensed) {
      alert(
        "You must be a licensed prescriber from Georgia to use this application"
      );
    } else {
      if (password != confirmationPassword) {
        setErrorCode("Your passwords don't match");
        return;
      } else if (name === "") {
        setErrorCode("You must enter your name");
        return;
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            dispatch(setAuthState({ user: user, isAuthenticated: true }));
            createProfile(user.uid, {
              email: user.email,
              name: name,
              phone_number: phone,
            });
          })
          .catch((error) => alert(error.message));
      }
    }
  };

  const createProfile = (uid: String, profile: Profile) => {
    let reference = ref(database, `users/${uid}`);
    set(reference, profile);
  };

  /***************		JSX		***************/

  return (
    <Layout>
      <Image
        alignSelf="center"
        source={image}
        maxHeight={200}
        maxWidth={200}
        resizeMode="contain"
        alt="P4M Logo"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <Card>
          <VStack space={3}>
            <HStack space={3} justifyContent="space-between">
              <Heading color="black">
                Register
              </Heading>
            </HStack>
            <Text>
              If you have not registered through the PEACE for Moms website,
              please do so{" "}
              <Link href="https://redcap-neuro.emory.edu/surveys/?s=T89FED9DEM">
                here
              </Link>{" "}
              before registering for the app
            </Text>
            <Input
              ref={nameInputRef}
              placeholder="Name"
              onChangeText={handleNameChange}
              onSubmitEditing={() => {
                phoneInputRef.current.focus();
              }}
            />
            <Input
              ref={phoneInputRef}
              placeholder="Phone Number (Optional)"
              onChangeText={handlePhoneChange}
              onSubmitEditing={() => {
                emailInputRef.current.focus();
              }}
            />
            <Input
              ref={emailInputRef}
              placeholder="Email"
              onChangeText={handleEmailChange}
              onSubmitEditing={() => {
                passwordInputRef.current.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              onSubmitEditing={() => {
                confirmPasswordInputRef.current.focus();
              }}
            />
            <Input
              ref={confirmPasswordInputRef}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmationPassword}
              onChangeText={setConfirmationPassword}
              onSubmitEditing={handleSignUp}
            />
            {errorCode && <Text>{errorCode}</Text>}
            <CheckBox
              onPress={() => setlicensed(!licensed)}
              title="Are you a Licensed Prescriber from the State of Georgia?"
              isChecked={licensed}
            />
            <Button onPress={handleSignUp}>Register</Button>
          </VStack>
        </Card>
      </KeyboardAvoidingView>
    </Layout>
  );
}
