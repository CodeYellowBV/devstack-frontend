import serializeObject from 'form-serializer';

// Use dot-notation for converting arrays.
$.extend(serializeObject.patterns, {
    validate: /^[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)*(?:\[\])?$/i,
});
