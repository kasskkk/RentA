export default function ApartmentForm() {
    return (
        <form>
            <div>Create Apartment</div>
            <div>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Name</legend>
                    <input type="text" className="input" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Description</legend>
                    <input type="text" className="input rows=3" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Price</legend>
                    <input type="number" className="input" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">City</legend>
                    <input type="text" className="input" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Street</legend>
                    <input type="text" className="input" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Building number</legend>
                    <input type="text" className="input" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Apartment number</legend>
                    <input type="text" className="input" placeholder="Type here" />
                    <p className="label">Optional</p>
                </fieldset>
                <div>
                    <button className="btn">Cancel</button>
                    <button className="btn">Submit</button>
                </div>
            </div>
        </form>
    )
}
