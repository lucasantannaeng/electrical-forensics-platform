import math
import struct

# Configuration from the .cfg file
# Frequency = 50 Hz (from the line after analog channels)
# Number of samples = 1000 (from the line after frequency)
# We'll generate 1000 samples at a sample rate of, say, 10 kHz (typical for COMTRADE)
# However, the .cfg does not specify the sample rate; it specifies the number of samples and the frequency of the signal.
# The time between samples is 1/(sample rate). The sample rate is not in the .cfg; it's implied by the number of samples and the duration.
# For simplicity, we'll assume the data file contains exactly the number of samples specified, and the time column starts at 0 and increments by a fixed delta.
# We'll set the sample rate to 10000 Hz (10 kHz) so that we have 1000 samples over 0.1 seconds.
# But the frequency of the signal is 50 Hz, so we'll have 5 cycles in 0.1 seconds.

num_samples = 1000
sample_rate = 10000.0  # Hz
fundamental = 50.0  # Hz
# Generate time array
time = [i / sample_rate for i in range(num_samples)]

# Generate three-phase voltages with some harmonic distortion
# Let's add a 5th harmonic at 250 Hz with 10% amplitude and a 7th harmonic at 350 Hz with 5% amplitude
va = []
vb = []
vc = []
for t in time:
    # Fundamental
    fa = math.sin(2 * math.pi * fundamental * t)
    fb = math.sin(2 * math.pi * fundamental * t - 2 * math.pi / 3)
    fc = math.sin(2 * math.pi * fundamental * t + 2 * math.pi / 3)
    # 5th harmonic
    fa5 = 0.1 * math.sin(2 * math.pi * 5 * fundamental * t)
    fb5 = 0.1 * math.sin(2 * math.pi * 5 * fundamental * t - 2 * math.pi / 3)
    fc5 = 0.1 * math.sin(2 * math.pi * 5 * fundamental * t + 2 * math.pi / 3)
    # 7th harmonic
    fa7 = 0.05 * math.sin(2 * math.pi * 7 * fundamental * t)
    fb7 = 0.05 * math.sin(2 * math.pi * 7 * fundamental * t - 2 * math.pi / 3)
    fc7 = 0.05 * math.sin(2 * math.pi * 7 * fundamental * t + 2 * math.pi / 3)
    va.append(fa + fa5 + fa7)
    vb.append(fb + fb5 + fb7)
    vc.append(fc + fc5 + fc7)

# Now we write the data file in ASCII format: time, VA, VB, VC
# We'll use 6 decimal places for time and voltages.
with open('backend/sample.dat', 'w') as f:
    for i in range(num_samples):
        f.write(f"{time[i]:.6f}, {va[i]:.6f}, {vb[i]:.6f}, {vc[i]:.6f}\n")

print("Generated sample.dat with", num_samples, "samples")