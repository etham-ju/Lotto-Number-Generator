'use client';

import { useState } from 'react'; 
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function Home() {
  const [uuidInput, setUuidInput] = useState('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [maxAttempts, setMaxAttempts] = useState(20);

  const generateLottoNumbers = (uuid: string) => {
    if (!isValidUUID(uuid)) {
      toast.error('Invalid UUID v4. Please enter a valid UUID.');
      setNumbers([]);
      return;
    }

    const sanitizedUuid = uuid.replace(/-/g, '');
    const lottoNumbers = new Set<number>();

    let i = 0;
    if (maxAttempts > 50) {
      toast.warn('High maxAttempts value may cause performance issues. Consider lowering it.');
    }
    while (lottoNumbers.size < 6 && i < maxAttempts) {
      const hexPart = sanitizedUuid.slice(i * 4, (i + 1) * 4);
      const number = parseInt(hexPart, 16) % 45 + 1; // Modulo to map to 1-45
      lottoNumbers.add(number); // Add the number to the set (duplicates are automatically handled)
      i++;
    }

    if (lottoNumbers.size < 6) {
      toast.error('Unable to generate sufficient unique numbers. Please try again.');
      setNumbers([]);
    } else {
      setNumbers(Array.from(lottoNumbers)); // Convert the set to an array
    }
  };

  const handleManualUUIDGeneration = () => {
    generateLottoNumbers(uuidInput);
  };

  const handleAutoUUIDGeneration = () => {
    const generatedUUID = uuidv4();
    setUuidInput(generatedUUID); // Update input field with generated UUID
    generateLottoNumbers(generatedUUID);
    toast.success('UUID has been successfully auto-generated!'); // Show a toast notification
  };

  const isValidUUID = (uuid: string) => {
    return UUID_REGEX.test(uuid);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Lotto Number Generator (1-45)</h1>

      <div className="flex flex-col items-center space-y-4">
        {/* Input field for user-entered UUID */}
        <input
          type="text"
          value={uuidInput}
          onChange={(e) => setUuidInput(e.target.value)}
          placeholder="Enter UUID v4"
          className="border border-gray-300 p-2 rounded w-80 mb-4"
        />

        <p className="text-sm text-gray-600">Max Attempts Number when UUID generation fails</p>
        {/* Input field for max attempts */}
        <input
          type="number"
          value={maxAttempts}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value > 0 && value <= 100) {
              setMaxAttempts(value);
            } else {
              toast.error('Please enter a valid number between 1 and 100 for max attempts.');
            }
          }}
          placeholder="Max Attempts"
          className="border border-gray-300 p-2 rounded w-80 mb-4"
        />

        {/* Button to generate numbers using manually entered UUID */}
        <button
          onClick={handleManualUUIDGeneration}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Generate Numbers from Entered UUID
        </button>

        {/* Button to auto-generate UUID and numbers */}
        <button
          onClick={handleAutoUUIDGeneration}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition duration-300"
        >
          Auto-Generate UUID and Numbers
        </button>
      </div>

      {numbers.length > 0 && (
        <div className="mt-6 text-xl">
          <p>Lotto Numbers: {numbers.join(', ')}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
