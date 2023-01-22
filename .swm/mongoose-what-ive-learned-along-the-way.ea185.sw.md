---
id: ea185
title: Mongoose-What I've learned along the way
file_version: 1.1.1
app_version: 1.0.17
---

# Model methods

## Model.`findOneAndUpdate`<swm-token data-swm-token=":src/services/auth.service.ts:26:11:11:`        const user = await User.findOneAndUpdate(`"/>

<br/>

*   the first param represents the query
    
*   the second is the data you want to update
    
*   the third param is options along with the update function
    
    *   `new`<swm-token data-swm-token=":src/services/auth.service.ts:29:3:3:`            { new: true, runValidators: true }`"/>: return the updated document
        
    *   `runValidators`<swm-token data-swm-token=":src/services/auth.service.ts:29:9:9:`            { new: true, runValidators: true }`"/>: run model validations when saving the new data
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/services/auth.service.ts
```typescript
26             const user = await User.findOneAndUpdate(
27                 { email },
28                 { verificationToken },
29                 { new: true, runValidators: true }
30             )
```

<br/>

`$set`<swm-token data-swm-token=":src/services/board.service.ts:75:3:4:`                { $set: { cards: list.cards } }`"/> means you can set a specific field to a value
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/services/board.service.ts
```typescript
73                 await List.findOneAndUpdate(
74                     { _id: list.id },
75                     { $set: { cards: list.cards } }
76                 )
```

<br/>

`$pull`<swm-token data-swm-token=":src/services/card.service.ts:106:1:2:`            $pull: { cards: cardId },`"/> means take out a value from a field. In this particular example means taking the `cardId`<swm-token data-swm-token=":src/services/card.service.ts:106:10:10:`            $pull: { cards: cardId },`"/> off the cards field.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/services/card.service.ts
```typescript
103        const list = await List.findOneAndUpdate(
104            { cards: cardId },
105            {
106                $pull: { cards: cardId },
107            },
108            { new: true }
109        )
```

<br/>

# Document methods

## Document.`populate`<swm-token data-swm-token=":src/services/board.service.ts:34:2:2:`        .populate({`"/>

<br/>

Sometimes you have an array of ids in your model which is a quite normal approach. And you want to send back not only the ids but also other documents with these ids.

The `path`<swm-token data-swm-token=":src/services/board.service.ts:35:1:1:`            path: &#39;lists&#39;,`"/> specify which field you would like to populate other documents into and the `select`<swm-token data-swm-token=":src/services/board.service.ts:37:1:1:`            select: &#39;id cards&#39;,`"/> represents the fields you want to include (or exclude by using the '-' symbol).

In this code snippet. This function will return all the Board documents with lists and members populated with some fields of their own.

<!-- empty line --><br/>
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/services/board.service.ts
```typescript
33         const boards = await Board.find()
34             .populate({
35                 path: 'lists',
36                 options: { sort: { createdAt: -1 } },
37                 select: 'id cards',
38             })
39             .populate({
40                 path: 'members',
41                 options: { sort: { updatedAt: -1 } },
42                 select: 'id name',
43             })
```

<br/>

You can even use another populate in a populate like this. It will populate card documents within the lists.

Also, you can sort populated documents by adding `options`<swm-token data-swm-token=":src/services/card.service.ts:55:1:1:`            options: { sort: { updatedAt: -1 } },`"/> with populate. As the `sort`<swm-token data-swm-token=":src/services/card.service.ts:55:6:6:`            options: { sort: { updatedAt: -1 } },`"/> option is to sort by a specific key with ascending order or descending order (represented by 1 and -1).
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/services/card.service.ts
```typescript
49         const board = await Board.findOne({ _id: boardId }).populate({
50             path: 'lists',
51             select: 'id',
52             populate: {
53                 path: 'cards',
54                 populate: 'activities',
55                 options: { sort: { updatedAt: -1 } },
56             },
57         })
```

<br/>

/co

# Schema

This and the next chapter is what I learned from reading Mongoose documents. Mostly it's just some notes taken from the document.

## Instance Methods

Instances of `Models` are [documents](https://mongoosejs.com/docs/documents.html). Documents have many of their own [built-in instance methods](https://mongoosejs.com/docs/api/document.html). We may also define our own custom document instance methods.

```javascript
// define a schema
const animalSchema = new Schema({ name: String, type: String },
{
  // Assign a function to the "methods" object of our animalSchema through schema options.
  // By following this approach, there is no need to create a separate TS type to define the type of the instance functions.
  methods: {
    findSimilarTypes(cb) {
      return mongoose.model('Animal').find({ type: this.type }, cb);
    }
  }
});

// Or, assign a function to the "methods" object of our animalSchema
animalSchema.methods.findSimilarTypes = function(cb) {
  return mongoose.model('Animal').find({ type: this.type }, cb);
};
```

> Note: Do **not** declare methods using ES6 arrow functions (`=>`). Arrow functions [explicitly prevent binding](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_binding_of_this) `this`, so your method will **not** have access to the document and the above examples will not work.

## Static Functions

```javascript
// define a schema
const animalSchema = new Schema({ name: String, type: String },
{
  // Assign a function to the "statics" object of our animalSchema through schema options.
  // By following this approach, there is no need to create a separate TS type to define the type of the statics functions. 
  statics: {
    findByName(name) {
      return this.find({ name: new RegExp(name, 'i') });
    }
  }
});

// Or, Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); });

const Animal = mongoose.model('Animal', animalSchema);
let animals = await Animal.findByName('fido');
animals = animals.concat(await Animal.findByBreed('Poodle'));
```

## Query Helpers

```javascript
// define a schema
const animalSchema = new Schema({ name: String, type: String },
{
  // Assign a function to the "query" object of our animalSchema through schema options.
  // By following this approach, there is no need to create a separate TS type to define the type of the query functions. 
  query:{
    byName(name){
      return this.where({ name: new RegExp(name, 'i') })
    }
  }
});

// Or, Assign a function to the "query" object of our animalSchema
animalSchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') })
};

const Animal = mongoose.model('Animal', animalSchema);

Animal.find().byName('fido').exec((err, animals) => {
  console.log(animals);
});

Animal.findOne().byName('fido').exec((err, animal) => {
  console.log(animal);
});
```

## Indexes

MongoDB supports [secondary indexes](http://docs.mongodb.org/manual/indexes/). With mongoose, we define these indexes within our `Schema` [at](https://mongoosejs.com/docs/api/schematype.html#schematype_SchemaType-index) [the](https://mongoosejs.com/docs/api/schematype.html#schematype_SchemaType-unique) [path](https://mongoosejs.com/docs/api/schematype.html#schematype_SchemaType-sparse) [level](https://mongoosejs.com/docs/api/schemadateoptions.html.html#schemadateoptions_SchemaDateOptions-expires) or the `schema` level. Defining indexes at the schema level is necessary when creating [compound indexes](https://docs.mongodb.com/manual/core/index-compound/).

```javascript
const animalSchema = new Schema({
  name: String,
  type: String,
  tags: { type: [String], index: true } // path level
});

animalSchema.index({ name: 1, type: -1 }); // schema level
```

> Note: The value of the field in the index specification describes the kind of index for that field. For example, a value of `1` specifies an index that orders items in ascending order. A value of `-1` specifies an index that orders items in descending order.

## Virtuals

[Virtuals](https://mongoosejs.com/docs/api/schema.html#schema_Schema-virtual) are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage.

```javascript
// That can be done either by adding it to schema options:
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
}, {
  virtuals: {
    fullName: {
      get() {
        return this.name.first + ' ' + this.name.last;
      }
    }
  }
});

// Or by using the virtual method as following:  
personSchema.virtual('fullName').get(function() {
  return this.name.first + ' ' + this.name.last;
});
```

If you use `toJSON()` or `toObject()` mongoose will _not_ include virtuals by default. This includes the output of calling `JSON.stringify()` on a Mongoose document because `JSON.stringify()` calls `toJSON()`. Pass `{ virtuals: true }` to either `toObject()` or `toJSON()`.

You can also add a custom setter to your virtual that will let you set both first name and last name via the `fullName` virtual.

```javascript
// Again that can be done either by adding it to schema options:
const personSchema = new Schema({
  name: {
    first: String,
    last: String
  }
}, {
  virtuals: {
    fullName: {
      get() {
        return this.name.first + ' ' + this.name.last;
      }
      set(v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
      }
    }
  }
});

// Or by using the virtual method as following:
personSchema.virtual('fullName').
  get(function() {
    return this.name.first + ' ' + this.name.last;
  }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"
```

Virtual property setters are applied before other validation. So the example above would still work even if the `first` and `last` name fields were required.

Only non-virtual properties work as part of queries and for field selection. Since virtuals are not stored in MongoDB, you can't query with them.

## Options

Schemas have a few configurable options which can be passed to the constructor or to the `set` method:

```javascript
new Schema({..}, options);

// or

const schema = new Schema({..});
schema.set(option, value);
```

Valid options:

> *   [autoIndex](https://mongoosejs.com/docs/guide.html#autoIndex)
>     
> *   [autoCreate](https://mongoosejs.com/docs/guide.html#autoCreate)
>     
> *   [bufferCommands](https://mongoosejs.com/docs/guide.html#bufferCommands)
>     
> *   [bufferTimeoutMS](https://mongoosejs.com/docs/guide.html#bufferTimeoutMS)
>     
> *   [capped](https://mongoosejs.com/docs/guide.html#capped)
>     
> *   [collection](https://mongoosejs.com/docs/guide.html#collection)
>     
> *   [discriminatorKey](https://mongoosejs.com/docs/guide.html#discriminatorKey)
>     
> *   [id](https://mongoosejs.com/docs/guide.html#id)
>     
> *   [\_id](https://mongoosejs.com/docs/guide.html#_id)
>     
> *   [minimize](https://mongoosejs.com/docs/guide.html#minimize)
>     
> *   [read](https://mongoosejs.com/docs/guide.html#read)
>     
> *   [writeConcern](https://mongoosejs.com/docs/guide.html#writeConcern)
>     
> *   [shardKey](https://mongoosejs.com/docs/guide.html#shardKey)
>     
> *   [statics](https://mongoosejs.com/docs/guide.html#statics)
>     
> *   [strict](https://mongoosejs.com/docs/guide.html#strict)
>     
> *   [strictQuery](https://mongoosejs.com/docs/guide.html#strictQuery)
>     
> *   [toJSON](https://mongoosejs.com/docs/guide.html#toJSON)
>     
> *   [toObject](https://mongoosejs.com/docs/guide.html#toObject)
>     
> *   [typeKey](https://mongoosejs.com/docs/guide.html#typeKey)
>     
> *   [validateBeforeSave](https://mongoosejs.com/docs/guide.html#validateBeforeSave)
>     
> *   [versionKey](https://mongoosejs.com/docs/guide.html#versionKey)
>     
> *   [optimisticConcurrency](https://mongoosejs.com/docs/guide.html#optimisticConcurrency)
>     
> *   [collation](https://mongoosejs.com/docs/guide.html#collation)
>     
> *   [timeseries](https://mongoosejs.com/docs/guide.html#timeseries)
>     
> *   [selectPopulatedPaths](https://mongoosejs.com/docs/guide.html#selectPopulatedPaths)
>     
> *   [skipVersioning](https://mongoosejs.com/docs/guide.html#skipVersioning)
>     
> *   [timestamps](https://mongoosejs.com/docs/guide.html#timestamps)
>     
> *   [storeSubdocValidationError](https://mongoosejs.com/docs/guide.html#storeSubdocValidationError)
>     
> *   [methods](https://mongoosejs.com/docs/guide.html#methods)
>     
> *   [query](https://mongoosejs.com/docs/guide.html#query-helpers)
>     

Read more about options in Mongoose [documents](https://mongoosejs.com/docs/guide.html#options).

# Schema Types

## What is a SchemaType?

> You can think of a Mongoose schema as the configuration object for a Mongoose model. A SchemaType is then a configuration object for an individual property. A SchemaType says what type a given path should have, whether it has any getters/setters, and what values are valid for that path.

This is an explanation from [Mongoose documents](https://mongoosejs.com/docs/schematypes.html#strings). What I would like to think of SchemaType is that it describes a 'characteristic' of a field (Or 'path' as the doc calls it) in a model. This kind of description can include default values, validations, max-length and etc.

For example, a String type can have so many options like if the path is a required path, if it is selected in a query or if it has an alias name. There are so many types in Mongoose that you can play around with.

> *   [String](https://mongoosejs.com/docs/schematypes.html#strings)
>     
> *   [Number](https://mongoosejs.com/docs/schematypes.html#numbers)
>     
> *   [Date](https://mongoosejs.com/docs/schematypes.html#dates)
>     
> *   [Buffer](https://mongoosejs.com/docs/schematypes.html#buffers)
>     
> *   [Boolean](https://mongoosejs.com/docs/schematypes.html#booleans)
>     
> *   [Mixed](https://mongoosejs.com/docs/schematypes.html#mixed)
>     
> *   [ObjectId](https://mongoosejs.com/docs/schematypes.html#objectids)
>     
> *   [Array](https://mongoosejs.com/docs/schematypes.html#arrays)
>     
> *   [Decimal128](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-Decimal128)
>     
> *   [Map](https://mongoosejs.com/docs/schematypes.html#maps)
>     
> *   [Schema](https://mongoosejs.com/docs/schematypes.html#schemas)
>     

## Type Options

### common options

Each of them has its own options and also some common options too (as listed blow).

> *   `required`: boolean or function, if true adds a [required validator](https://mongoosejs.com/docs/validation.html#built-in-validators) for this property
>     
> *   `default`: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
>     
> *   `select`: boolean, specifies default [projections](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/) for queries
>     
> *   `validate`: function, adds a [validator function](https://mongoosejs.com/docs/validation.html#built-in-validators) for this property
>     
> *   `get`: function, defines a custom getter for this property using `Object.defineProperty()`.
>     
> *   `set`: function, defines a custom setter for this property using `Object.defineProperty()`.
>     
> *   `alias`: string, mongoose >= 4.10.0 only. Defines a [virtual](https://mongoosejs.com/docs/guide.html#virtuals) with the given name that gets/sets this path.
>     
> *   `immutable`: boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has `isNew: true`.
>     
> *   `transform`: function, Mongoose calls this function when you call `Document#toJSON()` function, including when you `JSON.stringify()` a document
>     

### Unique options

For String type

> *   `lowercase`: boolean, whether to always call `.toLowerCase()` on the value
>     
> *   `uppercase`: boolean, whether to always call `.toUpperCase()` on the value
>     
> *   `trim`: boolean, whether to always call `.trim()` on the value
>     
> *   `match`: RegExp, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value matches the given regular expression
>     
> *   `enum`: Array, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is in the given array.
>     
> *   `minLength`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value length is not less than the given number
>     
> *   `maxLength`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value length is not greater than the given number
>     
> *   `populate`: Object, sets default [populate options](https://mongoosejs.com/docs/populate.html#query-conditions)
>     

For Number type

> *   `min`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is greater than or equal to the given minimum.
>     
> *   `max`: Number, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is less than or equal to the given maximum.
>     
> *   `enum`: Array, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is strictly equal to one of the values in the given array.
>     
> *   `populate`: Object, sets default [populate options](https://mongoosejs.com/docs/populate.html#query-conditions)
>     

for Date type

> *   `min`: Date, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is greater than or equal to the given minimum.
>     
> *   `max`: Date, creates a [validator](https://mongoosejs.com/docs/validation.html) that checks if the value is less than or equal to the given maximum.
>     
> *   `expires`: Number or String, creates a TTL index with the value expressed in seconds.
>     

for ObjectId type

> *   `populate`: Object, sets default [populate options](https://mongoosejs.com/docs/populate.html#query-conditions)
>     

Check [Mongoose Documents](https://mongoosejs.com/docs/schematypes.html#strings) if you need more information.

## How to declare and describe a path in code

### Declare a Path

The easiest way is like this:

```javascript
const schema = new Schema({ name: String });
```

Or you can use the key 'type':

```javascript
const schema = new Schema({
  name: { type: String },
  nested: {
    firstName: { type: String },
    lastName: { type: String }
  }
});
```

To declare an array of some type:

```javascript
const schema = new Schema({ name: [String] });
```

### Describe a Path

To describe the 'characteristic' a path has, simply add a key-value path in the path map:

```javascript
const schema2 = new Schema({
  test: {
    type: String,
    lowercase: true // Always convert `test` to lowercase
  }
});
```

```javascript
const numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});

const Number = mongoose.model('Number', numberSchema);

const doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3
```

For arrays, they are special because they implicitly have a default value of `[]` (empty array).

```javascript
const ToyBox = mongoose.model('ToyBox', ToyBoxSchema);
console.log((new ToyBox()).toys); // []
```

To overwrite this default, you need to set the default value to `undefined`

```javascript
const ToyBoxSchema = new Schema({
  toys: {
    type: [ToySchema],
    default: undefined
  }
});
```

Getters.

Getters are like virtuals for paths defined in your schema. For example, let's say you wanted to store user profile pictures as relative paths and then add the hostname in your application. Below is how you would structure your `userSchema`:

```javascript
const root = 'https://s3.amazonaws.com/mybucket';

const userSchema = new Schema({
  name: String,
  picture: {
    type: String,
    get: v => `${root}${v}`
  }
});

const User = mongoose.model('User', userSchema);

const doc = new User({ name: 'Val', picture: '/123.png' });
doc.picture; // 'https://s3.amazonaws.com/mybucket/123.png'
doc.toObject({ getters: false }).picture; // '/123.png'
```

Generally, you only use getters on primitive paths as opposed to arrays or subdocuments. Because getters override what accessing a Mongoose path returns, declaring a getter on an object may remove Mongoose change tracking for that path.

```javascript
const schema = new Schema({
  arr: [{ url: String }]
});

const root = 'https://s3.amazonaws.com/mybucket';

// Bad, don't do this!
schema.path('arr').get(v => {
  return v.map(el => Object.assign(el, { url: root + el.url }));
});

// Later
doc.arr.push({ key: String });
doc.arr[0]; // 'undefined' because every `doc.arr` creates a new array!
```

Instead of declaring a getter on the array as shown above, you should declare a getter on the `url` string as shown below. If you need to declare a getter on a nested document or array, be very careful!

```javascript
const schema = new Schema({
  arr: [{ url: String }]
});

const root = 'https://s3.amazonaws.com/mybucket';

// Good, do this instead of declaring a getter on `arr`
schema.path('arr.0.url').get(v => `${root}${v}`);
```

### Inspect an existing path

You can use schema.path() function to inspect the schema type for a given path, including what validators it has and what the type is.

```javascript
const sampleSchema = new Schema({ name: { type: String, required: true } });
console.log(sampleSchema.path('name'));
// Output looks like:
/**
 * SchemaString {
 *   enumValues: [],
  *   regExp: null,
  *   path: 'name',
  *   instance: 'String',
  *   validators: ...
  */
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc2NydW0tdHJhY2tlci1iZSUzQSUzQWx1bGlhbjY2Ng==/docs/ea185).
