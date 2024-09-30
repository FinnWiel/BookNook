import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';

// Define the props interface
interface BookProps {
    title: string;
    author: string;
    coverImage?: any;
}

const defaultImage = require('@/assets/images/base_img.jpg'); // Adjust this path as needed

const Book: React.FC<BookProps> = ({ title, author, coverImage }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Image source={coverImage || defaultImage} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.author}>{author}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 180,
        margin: 10,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 220,
    },
    textContainer: {
        padding: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 14,
        color: '#666',
    },
});

export default Book;
