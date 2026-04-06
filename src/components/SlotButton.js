import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../utils/Colors';

export default function SlotButton({ slot, isSelected, isBooked, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.slot,
        isSelected && styles.selectedSlot,
        isBooked && styles.bookedSlot,
      ]}
      onPress={onPress}
      disabled={isBooked}
    >
      <Text style={[
        styles.slotText,
        isSelected && { color: Colors.textWhite },
        isBooked && { color: Colors.textMuted }
      ]}>
        {isBooked ? "Booked" : slot}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  selectedSlot: { backgroundColor: Colors.success, borderColor: Colors.success },
  bookedSlot: { backgroundColor: "#e9ecef", borderColor: Colors.border },
  slotText: { fontWeight: '600', color: Colors.textWhite, fontSize: 16 },
});