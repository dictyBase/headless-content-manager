// @generated by protoc-gen-es v1.6.0
// @generated from file dictybase/identity/identity.proto (package dictybase.identity, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3, Timestamp } from "@bufbuild/protobuf";
import { Links } from "../api/jsonapi/payload_pb.js";

/**
 * Definition for various fields
 *
 * @generated from message dictybase.identity.IdentityAttributes
 */
export const IdentityAttributes = proto3.makeMessageType(
  "dictybase.identity.IdentityAttributes",
  () => [
    { no: 1, name: "identifier", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "provider", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "user_id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 5, name: "created_at", kind: "message", T: Timestamp },
    { no: 6, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message dictybase.identity.IdentityData
 */
export const IdentityData = proto3.makeMessageType(
  "dictybase.identity.IdentityData",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "attributes", kind: "message", T: IdentityAttributes },
    { no: 4, name: "links", kind: "message", T: Links },
  ],
);

/**
 * @generated from message dictybase.identity.Identity
 */
export const Identity = proto3.makeMessageType(
  "dictybase.identity.Identity",
  () => [
    { no: 1, name: "data", kind: "message", T: IdentityData },
    { no: 4, name: "links", kind: "message", T: Links },
  ],
);

/**
 * @generated from message dictybase.identity.IdentityProviderReq
 */
export const IdentityProviderReq = proto3.makeMessageType(
  "dictybase.identity.IdentityProviderReq",
  () => [
    { no: 1, name: "identifier", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "provider", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message dictybase.identity.CreateIdentityReq
 */
export const CreateIdentityReq = proto3.makeMessageType(
  "dictybase.identity.CreateIdentityReq",
  () => [
    { no: 1, name: "data", kind: "message", T: CreateIdentityReq_Data },
  ],
);

/**
 * @generated from message dictybase.identity.CreateIdentityReq.Data
 */
export const CreateIdentityReq_Data = proto3.makeMessageType(
  "dictybase.identity.CreateIdentityReq.Data",
  () => [
    { no: 1, name: "type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "attributes", kind: "message", T: NewIdentityAttributes },
  ],
  {localName: "CreateIdentityReq_Data"},
);

/**
 * @generated from message dictybase.identity.NewIdentityAttributes
 */
export const NewIdentityAttributes = proto3.makeMessageType(
  "dictybase.identity.NewIdentityAttributes",
  () => [
    { no: 1, name: "identifier", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "provider", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "user_id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);
