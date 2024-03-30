import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

import {Modal, Text, Portal, PaperProvider} from 'react-native-paper';

const ModalContent = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <Text>Modal Content</Text>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

export default ModalContent;

const styles = StyleSheet.create({});
