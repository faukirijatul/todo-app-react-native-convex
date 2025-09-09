import { createHomeStyles } from "@/assets/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

const TodoInput = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  const [newTodoText, setNewTodoText] = useState("");

  const addTodo = useMutation(api.todos.addTodo);

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      try {
        await addTodo({ text: newTodoText, isCompleted: false });
        setNewTodoText("");
      } catch (error) {
        console.error("Error adding todo:", error);
        Alert.alert("Error", "Failed to add todo");
      }
    }
  };

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={homeStyles.input}
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={handleAddTodo}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textMuted}
        />

        <TouchableOpacity
          onPress={handleAddTodo}
          activeOpacity={0.8}
          disabled={!newTodoText}
        >
          <LinearGradient
            colors={
              newTodoText.trim() ? colors.gradients.primary : colors.gradients.muted
            }
            style={[homeStyles.addButton, !newTodoText.trim() && homeStyles.addButtonDisabled]}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
