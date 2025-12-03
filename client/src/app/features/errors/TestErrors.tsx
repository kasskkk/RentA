import { useMutation } from '@tanstack/react-query';
import { useState } from "react";
import agent from '../../../lib/api/agent';

export default function TestErrors() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const { mutate } = useMutation({
        mutationFn: async ({ path, method = 'get' }: { path: string; method: string }) => {
            if (method === 'post') await agent.post(path, {});
            else await agent.get(path);
        },
        onError: (err) => {
            if (Array.isArray(err)) {
                setValidationErrors(err);
            } else {
                setValidationErrors([]);
            }
        },
    });

    const handleError = (path: string, method = 'get') => {
        mutate({ path, method });
    };

    return (
        <>
            <div >Test errors component</div>

            <div>
                <button className='btn' onClick={() => handleError('buggy/not-found')}>
                    Not found
                </button>
                <button className='btn' onClick={() => handleError('buggy/bad-request')}>
                    Bad request
                </button>
                <button className='btn' onClick={() => handleError('activities', 'post')}>
                    Validation error
                </button>
                <button className='btn' onClick={() => handleError('buggy/server-error')}>
                    Server error
                </button>
                <button className='btn' onClick={() => handleError('buggy/unauthorised')}>
                    Unauthorised
                </button>
            </div>
        </>
    );
}
