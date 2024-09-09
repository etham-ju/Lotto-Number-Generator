'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const [uuidInput, setUuidInput] = useState('');
    const [numbers, setNumbers] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    const generateLottoNumbers = (uuid: string) => {
        const sanitizedUuid = uuid.replace(/-/g, '');

        if (!isValidUUID(uuid)) {
            setError('Invalid UUID v4. Please enter a valid UUID.');
            setNumbers([]);
            return;
        }

        setError(null);

        const lottoNumbers = new Set<number>();

        let i = 0;
        while (lottoNumbers.size < 6) {
            const hexPart = sanitizedUuid.slice(i * 4, (i + 1) * 4);
            const number = parseInt(hexPart, 16) % 45 + 1; // Modulo to map to 1-45
            lottoNumbers.add(number); // Add the number to the set (duplicates are automatically handled)
            i++;
        }

        setNumbers(Array.from(lottoNumbers)); // Convert the set to an array
    };

    const handleManualUUIDGeneration = () => {
        generateLottoNumbers(uuidInput);
    };

    const handleAutoUUIDGeneration = () => {
        const generatedUUID = uuidv4();
        setUuidInput(generatedUUID); // Update input field with generated UUID
        generateLottoNumbers(generatedUUID);
    };

    const isValidUUID = (uuid: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
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

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {numbers.length > 0 && (
                <div className="mt-6 text-xl">
                    <p>Lotto Numbers: {numbers.join(', ')}</p>
                </div>
            )}
        </div>
    );
}
