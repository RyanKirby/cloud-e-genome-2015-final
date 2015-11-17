'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Variant Schema
 */
var VariantSchema = new Schema({
    Patient: {type: String},
    Chr: {type: String},
    Start: {type: Number},
    End: {type: Number},
    Ref: {type: String},
    Alt: {type: String},
    Func_knownGene: {type: String},
    Gene_knownGene: {type: String},
    ExonicFunc_knownGene: {type: String},
    AAChange_knownGene: {type: String},
    Func_ensGene: {type: String},
    Gene_ensGene: {type: String},
    ExonicFunc_ensGene: {type: String},
    AAChange_ensGene: {type: String},
    Func_refGene: {type: String},
    Gene_refGene: {type: String},
    ExonicFunc_refGene: {type: String},
    AAChange_refGene: {type: String},
    phastConsElements46way: {type: String},
    genomicSuperDups: {type: String},
    esp6500si_all: {type: String},
    maf_1000g2012apr_all: {type: Number},
    cg69: {type: Number},
    snp137: {type: String},
    LJB2_SIFT: {type: Number},
    LJB2_PolyPhen2_HDIV: {type: Number},
    LJB2_PP2_HDIV_Pred: {type: String},
    LJB2_PolyPhen2_HVAR: {type: Number},
    LJB2_PolyPhen2_HVAR_Pred: {type: String},
    LJB2_LRT: {type: Number},
    LJB2_LRT_Pred: {type: String},
    LJB2_MutationTaster: {type: Number},
    LJB2_MutationTaster_Pred: {type: String},
    LJB_MutationAssessor: {type: String},
    LJB_MutationAssessor_Pred: {type: String},
    LJB2_FATHMM: {type: Number},
    LJB2_GERP: {type: Number},
    LJB2_PhyloP: {type: Number},
    LJB2_SiPhy: {type: Number},
    VCF_Chr: {type: String},
    VCF_Pos: {type: Number},
    VCF_Ref: {type: String},
    VCF_Alt: {type: String},
    VCF_Qual: {type: Number},
    VCF_Info: {type: String},
    VCF_Format: {type: String},
    VCF_Sample_PFC_0028: {type: String},
    IA_Zygosity: {type: String},
    IA_GeneName: {type: String},
    IA_Local_MAF: {type: Number},
    IA_MAF_GATK: {type: String},
    IA_OMIMAnno_Go: {type: String},
    IA_OMIMAnno_Wiki: {type: String},
    IA_OMIMAnno_MIM: {type: String},
    IA_OMIMAnno_oMIM: {type: String},
    IA_GenecardsLink: {type: String},
    IA_OMIMLink: {type: String},
    IA_UniprotLink: {type: String},
    EF_Count: {type: Number}
});

mongoose.model('Variant', VariantSchema);