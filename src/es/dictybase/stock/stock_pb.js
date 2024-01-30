// @generated by protoc-gen-es v1.6.0
// @generated from file dictybase/stock/stock.proto (package dictybase.stock, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * @generated from message dictybase.stock.StockId
 */
export const StockId = proto3.makeMessageType(
  "dictybase.stock.StockId",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Definition for list of unique stock identifier
 *
 * @generated from message dictybase.stock.StockIdList
 */
export const StockIdList = proto3.makeMessageType(
  "dictybase.stock.StockIdList",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);

/**
 * Definition of an individual strain
 *
 * @generated from message dictybase.stock.Strain
 */
export const Strain = proto3.makeMessageType(
  "dictybase.stock.Strain",
  () => [
    { no: 1, name: "data", kind: "message", T: Strain_Data },
  ],
);

/**
 * @generated from message dictybase.stock.Strain.Data
 */
export const Strain_Data = proto3.makeMessageType(
  "dictybase.stock.Strain.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: StrainAttributes },
  ],
  {localName: "Strain_Data"},
);

/**
 * Definition of an individual plasmid
 *
 * @generated from message dictybase.stock.Plasmid
 */
export const Plasmid = proto3.makeMessageType(
  "dictybase.stock.Plasmid",
  () => [
    { no: 1, name: "data", kind: "message", T: Plasmid_Data },
  ],
);

/**
 * @generated from message dictybase.stock.Plasmid.Data
 */
export const Plasmid_Data = proto3.makeMessageType(
  "dictybase.stock.Plasmid.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: PlasmidAttributes },
  ],
  {localName: "Plasmid_Data"},
);

/**
 * Definition of various strain attributes
 *
 * @generated from message dictybase.stock.StrainAttributes
 */
export const StrainAttributes = proto3.makeMessageType(
  "dictybase.stock.StrainAttributes",
  () => [
    { no: 1, name: "created_at", kind: "message", T: Timestamp },
    { no: 2, name: "updated_at", kind: "message", T: Timestamp },
    { no: 3, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 9, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 10, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 11, name: "label", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "species", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 13, name: "plasmid", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 14, name: "parent", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 15, name: "names", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 16, name: "dicty_strain_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Definition of various stock attributes
 *
 * @generated from message dictybase.stock.PlasmidAttributes
 */
export const PlasmidAttributes = proto3.makeMessageType(
  "dictybase.stock.PlasmidAttributes",
  () => [
    { no: 1, name: "created_at", kind: "message", T: Timestamp },
    { no: 2, name: "updated_at", kind: "message", T: Timestamp },
    { no: 3, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 9, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 10, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 11, name: "image_map", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "sequence", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 13, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 14, name: "dicty_plasmid_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Definition for creating a new strain
 *
 * @generated from message dictybase.stock.NewStrain
 */
export const NewStrain = proto3.makeMessageType(
  "dictybase.stock.NewStrain",
  () => [
    { no: 1, name: "data", kind: "message", T: NewStrain_Data },
  ],
);

/**
 * @generated from message dictybase.stock.NewStrain.Data
 */
export const NewStrain_Data = proto3.makeMessageType(
  "dictybase.stock.NewStrain.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "attributes", kind: "message", T: NewStrainAttributes },
  ],
  {localName: "NewStrain_Data"},
);

/**
 * Definition for creating a new plasmid
 *
 * @generated from message dictybase.stock.NewPlasmid
 */
export const NewPlasmid = proto3.makeMessageType(
  "dictybase.stock.NewPlasmid",
  () => [
    { no: 1, name: "data", kind: "message", T: NewPlasmid_Data },
  ],
);

/**
 * @generated from message dictybase.stock.NewPlasmid.Data
 */
export const NewPlasmid_Data = proto3.makeMessageType(
  "dictybase.stock.NewPlasmid.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "attributes", kind: "message", T: NewPlasmidAttributes },
  ],
  {localName: "NewPlasmid_Data"},
);

/**
 * Defines attributes for creating a new strain
 *
 * @generated from message dictybase.stock.NewStrainAttributes
 */
export const NewStrainAttributes = proto3.makeMessageType(
  "dictybase.stock.NewStrainAttributes",
  () => [
    { no: 1, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 7, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 9, name: "label", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "species", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 11, name: "plasmid", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "parent", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 13, name: "names", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 14, name: "dicty_strain_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Defines attributes for creating a new plasmid
 *
 * @generated from message dictybase.stock.NewPlasmidAttributes
 */
export const NewPlasmidAttributes = proto3.makeMessageType(
  "dictybase.stock.NewPlasmidAttributes",
  () => [
    { no: 1, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 7, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 9, name: "image_map", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "sequence", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 11, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "dicty_plasmid_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Definition for loading an existing strain
 *
 * @generated from message dictybase.stock.ExistingStrain
 */
export const ExistingStrain = proto3.makeMessageType(
  "dictybase.stock.ExistingStrain",
  () => [
    { no: 1, name: "data", kind: "message", T: ExistingStrain_Data },
  ],
);

/**
 * @generated from message dictybase.stock.ExistingStrain.Data
 */
export const ExistingStrain_Data = proto3.makeMessageType(
  "dictybase.stock.ExistingStrain.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: ExistingStrainAttributes },
  ],
  {localName: "ExistingStrain_Data"},
);

/**
 * Definition for loading an existing plasmid
 *
 * @generated from message dictybase.stock.ExistingPlasmid
 */
export const ExistingPlasmid = proto3.makeMessageType(
  "dictybase.stock.ExistingPlasmid",
  () => [
    { no: 1, name: "data", kind: "message", T: ExistingPlasmid_Data },
  ],
);

/**
 * @generated from message dictybase.stock.ExistingPlasmid.Data
 */
export const ExistingPlasmid_Data = proto3.makeMessageType(
  "dictybase.stock.ExistingPlasmid.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: ExistingPlasmidAttributes },
  ],
  {localName: "ExistingPlasmid_Data"},
);

/**
 * Defines attributes for loading an existing strain
 *
 * @generated from message dictybase.stock.ExistingStrainAttributes
 */
export const ExistingStrainAttributes = proto3.makeMessageType(
  "dictybase.stock.ExistingStrainAttributes",
  () => [
    { no: 1, name: "created_at", kind: "message", T: Timestamp },
    { no: 2, name: "updated_at", kind: "message", T: Timestamp },
    { no: 3, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 8, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 9, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 11, name: "label", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "species", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 13, name: "plasmid", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 14, name: "parent", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 15, name: "names", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 16, name: "dicty_strain_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Defines attributes for loading an existing plasmid
 *
 * @generated from message dictybase.stock.ExistingPlasmidAttributes
 */
export const ExistingPlasmidAttributes = proto3.makeMessageType(
  "dictybase.stock.ExistingPlasmidAttributes",
  () => [
    { no: 1, name: "created_at", kind: "message", T: Timestamp },
    { no: 2, name: "updated_at", kind: "message", T: Timestamp },
    { no: 3, name: "created_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 8, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 9, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 11, name: "image_map", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "sequence", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 13, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 14, name: "dicty_plasmid_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Definition for creating a new strain
 *
 * @generated from message dictybase.stock.StrainUpdate
 */
export const StrainUpdate = proto3.makeMessageType(
  "dictybase.stock.StrainUpdate",
  () => [
    { no: 1, name: "data", kind: "message", T: StrainUpdate_Data },
  ],
);

/**
 * @generated from message dictybase.stock.StrainUpdate.Data
 */
export const StrainUpdate_Data = proto3.makeMessageType(
  "dictybase.stock.StrainUpdate.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: StrainUpdateAttributes },
  ],
  {localName: "StrainUpdate_Data"},
);

/**
 * Definition for creating a new plasmid
 *
 * @generated from message dictybase.stock.PlasmidUpdate
 */
export const PlasmidUpdate = proto3.makeMessageType(
  "dictybase.stock.PlasmidUpdate",
  () => [
    { no: 1, name: "data", kind: "message", T: PlasmidUpdate_Data },
  ],
);

/**
 * @generated from message dictybase.stock.PlasmidUpdate.Data
 */
export const PlasmidUpdate_Data = proto3.makeMessageType(
  "dictybase.stock.PlasmidUpdate.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: PlasmidUpdateAttributes },
  ],
  {localName: "PlasmidUpdate_Data"},
);

/**
 * Defines attributes for updating a strain
 *
 * @generated from message dictybase.stock.StrainUpdateAttributes
 */
export const StrainUpdateAttributes = proto3.makeMessageType(
  "dictybase.stock.StrainUpdateAttributes",
  () => [
    { no: 1, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 7, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 8, name: "label", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 9, name: "species", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "plasmid", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 11, name: "parent", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 12, name: "names", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 13, name: "dicty_strain_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Defines attributes for updating a plasmid
 *
 * @generated from message dictybase.stock.PlasmidUpdateAttributes
 */
export const PlasmidUpdateAttributes = proto3.makeMessageType(
  "dictybase.stock.PlasmidUpdateAttributes",
  () => [
    { no: 1, name: "updated_by", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "editable_summary", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "depositor", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "genes", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "dbxrefs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 7, name: "publications", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 8, name: "image_map", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 9, name: "sequence", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 11, name: "dicty_plasmid_property", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * List of strains without any metadata for pagination
 *
 * @generated from message dictybase.stock.StrainList
 */
export const StrainList = proto3.makeMessageType(
  "dictybase.stock.StrainList",
  () => [
    { no: 1, name: "data", kind: "message", T: StrainList_Data, repeated: true },
  ],
);

/**
 * @generated from message dictybase.stock.StrainList.Data
 */
export const StrainList_Data = proto3.makeMessageType(
  "dictybase.stock.StrainList.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: StrainAttributes },
  ],
  {localName: "StrainList_Data"},
);

/**
 * List of strains
 *
 * @generated from message dictybase.stock.StrainCollection
 */
export const StrainCollection = proto3.makeMessageType(
  "dictybase.stock.StrainCollection",
  () => [
    { no: 1, name: "data", kind: "message", T: StrainCollection_Data, repeated: true },
    { no: 2, name: "meta", kind: "message", T: Meta },
  ],
);

/**
 * @generated from message dictybase.stock.StrainCollection.Data
 */
export const StrainCollection_Data = proto3.makeMessageType(
  "dictybase.stock.StrainCollection.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: StrainAttributes },
  ],
  {localName: "StrainCollection_Data"},
);

/**
 * List of plasmids
 *
 * @generated from message dictybase.stock.PlasmidCollection
 */
export const PlasmidCollection = proto3.makeMessageType(
  "dictybase.stock.PlasmidCollection",
  () => [
    { no: 1, name: "data", kind: "message", T: PlasmidCollection_Data, repeated: true },
    { no: 2, name: "meta", kind: "message", T: Meta },
  ],
);

/**
 * @generated from message dictybase.stock.PlasmidCollection.Data
 */
export const PlasmidCollection_Data = proto3.makeMessageType(
  "dictybase.stock.PlasmidCollection.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "attributes", kind: "message", T: PlasmidAttributes },
  ],
  {localName: "PlasmidCollection_Data"},
);

/**
 * StockParameters defines fields for manipulating output of Stock collection
 *
 * @generated from message dictybase.stock.StockParameters
 */
export const StockParameters = proto3.makeMessageType(
  "dictybase.stock.StockParameters",
  () => [
    { no: 1, name: "cursor", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "limit", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "filter", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * Metadata definition for traversing the collection
 *
 * @generated from message dictybase.stock.Meta
 */
export const Meta = proto3.makeMessageType(
  "dictybase.stock.Meta",
  () => [
    { no: 1, name: "next_cursor", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "limit", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "total", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

