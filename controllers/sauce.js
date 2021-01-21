const Sauce = require('../models/Sauce');
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, //spread
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: "Sauce enregistré"
        }))
        .catch(error => res.status(400).json({
            error
        })); // equivalent {error: error}
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // y a t'il un nouveau fichier?
        // {s'il y en a un}    
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } :
        // {s'il n'y en a pas}
        {
            ...req.body
        }
    Sauce.updateOne({
            _id: req.params.id //objet de comparaison
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(sauce => res.status(200).json({
            message: "Sauce modifiée"
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: "Sauce supprimée"
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            })
        })
        .catch(error => res.status(500).json({
            error
        }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(Sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};