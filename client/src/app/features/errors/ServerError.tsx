import { useLocation } from "react-router"

export default function ServerError() {
    const { state } = useLocation();
    return (
        <>
            {state.error ? (
                <>
                    <div>
                        {state.error?.message || 'There has been an error'}
                    </div>
                    <div></div>
                    <div>
                        {state.error?.details || 'Internal server error'}
                    </div>
                </>
            ) : (
                <div>Server error</div>
            )}
        </>
    )
}
