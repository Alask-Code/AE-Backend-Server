exports.execute = (url, info, sessionID) => {
    // Return array of all customization IDs.
    let t = []
    for (let k in customization_f.getCustomization()) {
        let i = customization_f.getCustomization()[k]
        if (!i._props.Side || JSON.stringify(i._props.Side) == "[]") {
            continue;
        } else {
            t.push(i._id)
        }
    }
    return response_f.getBody(t)
}