const productModel = require("../models/productModel")
const { uploadFile } = require('../utils/aws')
const {
    isValid,
    isValidRequestBody,
    isValidObjectId,
    checkImage,
    titleCheck,
    isValidPrice,
    isValidInstallment
} = require("../utils/validator")


// ============== POST / Create Poduct =======================//


const createProduct = async function (req, res) {
    try {
        let data = JSON.parse(JSON.stringify(req.body));
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: 'Enter details for user creation.' })

        let files = req.files
        let uploadedFileURL
        if (files && files.length > 0) {
            uploadedFileURL = await uploadFile(files[0])
        } else {
            res.status(400).send({
                msg: "Provide Product Image"
            })
        }

        const productImageUrl = await uploadFile(files[0])

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "Enter Title" })
        if (!titleCheck(title)) return res.status(400).send({ status: false, msg: "Enter Title is not valid" })

        let usedTitle = await productModel.findOne({ title: title })
        if (usedTitle) return res.status(400).send({ status: false, msg: "Title already Present" })

        if (!isValid(description)) return res.status(400).send({ status: false, msg: "Enter description" })

        if (!isValid(price)) return res.status(400).send({
            status: false,
            msg: "Enter Price"
        })
        if (!isValidPrice(price)) return res.status(400).send({
            status: false,
            msg: "Bad Price"
        })

        if (!isValid(currencyId)) return res.status(400).send({
            status: false,
            msg: "Enter Currency Id"
        })
        if (!(/INR/.test(currencyId))) return res.status(400).send({
            status: false,
            msg: "Bad CurrencyId"
        })

        if (!isValid(currencyFormat)) return res.status(400).send({
            status: false,
            msg: "Enter Currency Format"
        })
        if (!(/₹/.test(currencyFormat))) return res.status(400).send({
            status: false,
            msg: "Bad CurrencyFormat"
        })

        if (isValid(isFreeShipping) && !['true', 'false'].includes(isFreeShipping)) return res.status(400).send({
            status: false,
            msg: "isFreeShipping must be boolean value"
        })

        if (!isValid(availableSizes)) return res.status(400).send({
            status: false,
            msg: "Add Sizes"
        })
        if (availableSizes) {
            var arr1 = ["S", "XS", "M", "X", "L", "XXL", "XL"]
            var arr2 = availableSizes.toUpperCase().split(",").map((s) => s.trim())
            console.log(arr2)
            for (let i = 0; i < arr2.length; i++) {
                if (!(arr1.includes(arr2[i]))) {
                        return res.status(400).send({
                        status: false,
                        message: "availableSizes must be [S, XS, M, X, L, XXL, XL]"
                    });
                
                }
            }
        }

        if (!isValid(installments)) return res.status(400).send({
            status: false,
            msg: "Enter installments"
        })
        if (!isValidInstallment(installments)) return res.status(400).send({
            status: false,
            msg: "Bad installments field"
        })

        if (!checkImage(files[0].originalname))
            return res.status(400).send({
                status: false,
                message: "format must be jpeg/jpg/png only"
            })

        let result = {
            title,
            description,
            price,
            currencyId,
            currencyFormat,
            isFreeShipping,
            style,
            availableSizes: arr2,
            installments,
            productImage: productImageUrl
        }

        let created = await productModel.create(result)
        res.status(201).send({
            status: true,
            msg: "Success",
            data: created
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


// ============== GET / Get Poduct using filter =======================//



const getProduct = async function (req, res) {
    try {
        const queryParams = req.query;
        const filter = {
            isDeleted: false
        };

        const {
            size,
            name,
            priceGreaterThan,
            priceLessThan,
            priceSort
        } = queryParams

        if (Object.keys(queryParams).length !== 0) {

            if (isValid(size)) {
                if (Array.isArray(size) && size.length > 0) {
                    for (let i = 0; i < size.length; i++) {
                        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size[i])) {
                            res.status(400).send({
                                status: false,
                                msg: 'Size should be: "S", "XS", "M", "X", "L", "XXL", "XL" '
                            })
                        }
                    }
                    filter['availableSizes'] = size
                } else {
                    res.status(400).send({
                        status: false,
                        msg: 'size should be in array like; ["S", "XS", "M", "X", "L", "XXL", "XL"] '
                    })

                }
            }

            if (isValid(name)) {
                const regexName = new RegExp(name, "i")
                filter.title = {
                    $regex: regexName
                }
            }

            if (priceGreaterThan) {
                if (!isValid(priceGreaterThan)) {
                    filter.price = {
                        $gt: priceGreaterThan
                    }
                }
            }
            if (priceLessThan) {
                if (!isValid(priceLessThan)) {
                    filter.price = {
                        $lt: priceLessThan
                    }
                }
            }
            if (priceSort) {
                if (!(priceSort == 1 || priceSort == -1))
                    return res.status(400).send({
                        status: false,
                        msg: "Price sort by the value 1 and -1 only"
                    })
            }
        }


        const getProductDetails = await productModel.find(filter).sort({
            price: priceSort
        })
        res.status(200).send({
            status: true,
            msg: "Prodect Details find Successsully",
            data: getProductDetails
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


// ============== GET / Get Poduct by product Id =======================//



const getProductById = async function (req, res) {
    try {
        const productId = req.params.productId

        if (!isValidObjectId(productId)) {
            return res.status(400).send({
                status: false,
                msg: "Please enter a valid productId"
            })
        }

        const findProduct = await productModel.findOne({
            _id: productId,
            isDeleted: false
        })

        if (!findProduct) return res.status(404).send({
            status: false,
            msg: "Product not found"
        })
        res.status(200).send({
            status: true,
            data: findProduct
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


// ============== PUT / Update Poduct =======================//



const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId;
        let requestBody = req.body
        const files = req.files

        if (!isValidObjectId(productId)) {
            return res.status(400).send({
                status: false,
                msg: 'Invalid productId'
            })
        }
        const productDetails = await productModel.findById(productId)
        if (!productDetails) {
            return res.status(404).send({
                status: false,
                msg: 'Product Not Found'
            })
        }
        if (productDetails.isDeleted == true) {
            return res.status(400).send({
                status: false,
                msg: 'Product is already Deleted'
            })
        }

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false,
                msg: 'Enter atleast One detail to update'
            })
        }

        const {
            title,
            description,
            price,
            isFreeShipping,
            style,
            availableSizes,
            installments
        } = requestBody

        if (isValid(title)) {
            if (!titleCheck(title)) return res.status(400).send({
                status: false,
                msg: "Enter Title is not valid"
            })
            productDetails.title = title
        }

        if (isValid(description)) {
            productDetails.description = description
        }

        if (isValid(price)) {
            if (!isValidPrice(price)) return res.status(400).send({
                status: false,
                msg: "Bad Price"
            })
            productDetails.price = price
        }

        if (isValid(isFreeShipping)) {
            if (!['true', 'false'].includes(isFreeShipping))
                return res.status(400).send({
                    status: false,
                    msg: "isFreeShipping must be boolean value"
                })
            productDetails.isFreeShipping = isFreeShipping
        }

        if (req.files) {
            if (files && req.files.length > 0) {
                if (!checkImage(files[0].originalname))
                    return res.status(400).send({status: false, message: "format must be jpeg/jpg/png only"})
                let uploadedFileURL = await uploadFile(files[0])
                productDetails.productImage = uploadedFileURL
            }
        }

        if (isValid(style)) {
            productDetails.style = style
        }

        if (availableSizes) {
            if (!isValid(availableSizes))
                if (availableSizes) {
                    let arr1 = ["S", "XS", "M", "X", "L", "XXL", "XL"]
                    var arr2 = availableSizes.toUpperCase().split(",").map((s) => s.trim())
                    for (let i = 0; i < arr2.length; i++) {
                        if (!arr1.includes(arr2[i])) {
                            return res.status(400).send({
                                status: false,
                                message: "availableSizes must be [S, XS, M, X, L, XXL, XL]"
                            });
                        }
                    }
                    productDetails.availableSizes = arr2
                }
        }

        if (isValid(installments)) {
            if (isValidInstallment(installments)) return res.status(400).send({
                status: false,
                msg: "Bad installments field"
            })

            productDetails.installments = installments
        }

        await productDetails.save();
        return res.status(200).send({ status: true, message: "Product updated", data: productDetails })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


// ============== DELETE / Delete Poduct =======================//


const deleteProductById = async function (req, res) {
    try {
        const productId = req.params.productId

        if (!isValidObjectId(productId)) {
            return res.status(400).send({
                status: false,
                msg: "Please enter a valid productId"
            })
        }

        const findProduct = await productModel.findOne({
            _id: productId,
            isDeleted: false
        })
        if (!findProduct) return res.status(404).send({
            status: false,
            msg: "Product not found"
        })

        let deletedProduct = await productModel.findOneAndUpdate({
            _id: productId
        }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date()
            }
        }, {
            new: true
        })
        res.status(200).send({
            status: true,
            message: " Product Deleted Successfully",
            data: deletedProduct
        })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProductById
}