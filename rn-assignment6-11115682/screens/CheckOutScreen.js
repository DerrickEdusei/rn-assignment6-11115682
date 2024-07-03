import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ route, navigation }) => {
  const { cart: initialCart } = route.params;
  const [cart, setCart] = useState(initialCart);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const totalCost = cart.reduce((sum, item) => sum + item.price, 0);
      setTotal(totalCost);
    };
    calculateTotal();
  }, [cart]);

  const removeItem = async (id) => {
    const updatedCart = cart.filter(item => item.uniqueKey !== id);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const renderItem = ({ item }) => (
    <View style={styles.product}>
      <View style={styles.productContainer}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.uniqueKey)}>
        <Image source={require('../assets/remove.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/Logo.png')} style={styles.logo} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Image source={require('../assets/Search.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <Image source={require('../assets/checkout.png')} style={styles.checkOutLogo} />
        <FlatList
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item) => item.uniqueKey}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>EST. TOTAL</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    textTransform: 'uppercase',
  },
  subContainer: {
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  checkOutLogo: {
    width: 150,
    height: 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  product: {
    marginBottom: 25,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  image: {
    width: 118,
    height: 140,
    resizeMode: 'contain',
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 16,
    color: '#f00',
    marginTop: 5,
  },
  removeButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    // paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    color: '#f00',
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
