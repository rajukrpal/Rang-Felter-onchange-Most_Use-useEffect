import axios from 'axios';

export const getProductData = async () => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products', {
            headers: {
                // Authorization: tokenFetch,
                // 'Content-type': 'application/json; charset=UTF-8',
                'Content-type': "multipart/form-data"
            },
        })
        return await response.data
    } catch (error) {
        console.log(error)
    }



}

/// https://forum.freecodecamp.org/t/multipart-form-submission-with-react/659574