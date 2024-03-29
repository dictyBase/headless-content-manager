// @generated by protoc-gen-es v1.6.0
// @generated from file dictybase/api/jsonapi/request.proto (package dictybase.api.jsonapi, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * A `GetRequest` defines various url and query parameters that could be passed
 * in a HTTP **GET** request to a singular resource. Majority of the request
 * parameters are identical or similar to [jsonapi](http://jsonapi.org).
 *
 * @generated from message dictybase.api.jsonapi.GetRequest
 */
export const GetRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.GetRequest",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "include", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "fields", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * A `GetEmailRequest` is identical to GetRequest except `email` id used as unique identifier.
 *
 * @generated from message dictybase.api.jsonapi.GetEmailRequest
 */
export const GetEmailRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.GetEmailRequest",
  () => [
    { no: 1, name: "email", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "include", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "fields", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * A `GetRequestWithFields` is a subset of GetRequest which only allow the fields parameter.
 *
 * @generated from message dictybase.api.jsonapi.GetRequestWithFields
 */
export const GetRequestWithFields = proto3.makeMessageType(
  "dictybase.api.jsonapi.GetRequestWithFields",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "fields", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * A `RelationshipRequest` defines the url parameter for relationship resources
 * that are given in the links field of relationship object
 *
 * @generated from message dictybase.api.jsonapi.RelationshipRequest
 */
export const RelationshipRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.RelationshipRequest",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * A `RelationshipRequestWithPagination` is a `RelationshipRequest` with pagination
 *
 * @generated from message dictybase.api.jsonapi.RelationshipRequestWithPagination
 */
export const RelationshipRequestWithPagination = proto3.makeMessageType(
  "dictybase.api.jsonapi.RelationshipRequestWithPagination",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 4, name: "pagenum", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "pagesize", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * A `ListRequest` defines various url and query parameters that could be
 * passed in a HTTP **GET** request to a collection resource. All collection
 * resources are expected to support pagination. Majority of the request
 * parameters are identical or similar to [jsonapi](http://jsonapi.org).
 *
 * @generated from message dictybase.api.jsonapi.ListRequest
 */
export const ListRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.ListRequest",
  () => [
    { no: 1, name: "include", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "fields", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "pagenum", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 5, name: "pagesize", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 6, name: "filter", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * A `SimpleListRequest` is identical to `ListRequest` except it does not support
 * pagination. The rest of the parameters are identical to `ListRequest` definition.
 *
 * @generated from message dictybase.api.jsonapi.SimpleListRequest
 */
export const SimpleListRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.SimpleListRequest",
  () => [
    { no: 1, name: "include", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "fields", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "filter", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * A `DeleteRequest` defines the url parameter that must be passed
 * to remove a singular resource.
 *
 * @generated from message dictybase.api.jsonapi.DeleteRequest
 */
export const DeleteRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.DeleteRequest",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * @generated from message dictybase.api.jsonapi.IdRequest
 */
export const IdRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.IdRequest",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * @generated from message dictybase.api.jsonapi.IdResponse
 */
export const IdResponse = proto3.makeMessageType(
  "dictybase.api.jsonapi.IdResponse",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * @generated from message dictybase.api.jsonapi.HealthzIdRequest
 */
export const HealthzIdRequest = proto3.makeMessageType(
  "dictybase.api.jsonapi.HealthzIdRequest",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * ExistResponse wraps a boolean response
 *
 * @generated from message dictybase.api.jsonapi.ExistResponse
 */
export const ExistResponse = proto3.makeMessageType(
  "dictybase.api.jsonapi.ExistResponse",
  () => [
    { no: 1, name: "exist", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

