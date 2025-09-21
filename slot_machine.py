import random

# Create a symbols list with fruits and sevens
symbols = ['🍒', '🍇', '🍉', '7️⃣']

# Get three random symbols using random.choices()
results = random.choices(symbols, k=3)

# Print the results separated by pipe characters
print(f"{results[0]} | {results[1]} | {results[2]}")

# Check if all three symbols are sevens for jackpot
if all(symbol == '7️⃣' for symbol in results):
    print("Jackpot! 💰")
else:
    print("Thanks for playing!")