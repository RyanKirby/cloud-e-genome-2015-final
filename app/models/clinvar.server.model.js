'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Clinvar Schema
 */
var ClinvarSchema = new Schema({
    AlleleID: Number,
    Type: String,
    Name: String,
    GeneID: Number,
    GeneSymbol: String,
    ClinicalSignificance: String,
    RS_dbSNP:Number,
    nsv_dbVar: String,
    RCVaccession: String,
    TestedInGTR: String,
    PhenotypeIDs: String,
    Origin: String,
    Assembly: String,
    Chromosome: Number,
    Start: Number,
    Stop: Number,
    Cytogenetic: String,
    ReviewStatus: String,
    HGVS_c: String,
    HGVS_pD: String,
    NumberSubmitters: Number,
    LastEvaluated: String,
    Guidelines: String,
    OtherIDs: String,
    VariantID: Number,
    OmimSearch: String

});

mongoose.model('Clinvar', ClinvarSchema);