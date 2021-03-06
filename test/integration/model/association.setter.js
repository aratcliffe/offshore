var Offshore = require('../../../lib/offshore'),
    assert = require('assert');

describe('Model', function() {
  describe('association', function() {
    describe('setter', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var collection;

      before(function(done) {
        var offshore = new Offshore();

        var User = Offshore.Collection.extend({
          connection: 'my_foo',
          tableName: 'person',
          attributes: {
            preferences: {
              collection: 'preference',
              via: 'user'
            }
          }
        });

        var Preference = Offshore.Collection.extend({
          connection: 'my_foo',
          tableName: 'preference',
          attributes: {
            user: {
              model: 'person'
            }
          }
        });

        offshore.loadCollection(User);
        offshore.loadCollection(Preference);

        var _values = [
          { preference: [{ foo: 'bar' }, { foo: 'foobar' }] },
          { preference: [{ foo: 'a' }, { foo: 'b' }] },
        ];

        var adapterDef = {
          find: function(con, col, criteria, cb) { return cb(null, _values); }
        };

        var connections = {
          'my_foo': {
            adapter: 'foobar'
          }
        };

        offshore.initialize({ adapters: { foobar: adapterDef }, connections: connections }, function(err, colls) {
          if(err) done(err);
          collection = colls.collections.person;
          done();
        });
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should allow new associations to be added using the add function', function(done) {
        collection.find().exec(function(err, data) {
          if(err) return done(err);

          data[0].preferences.add(1);
          assert(data[0].associations.preferences.addModels.length === 1);

          done();
        });
      });

      it('should allow new associations to be removed using the remove function', function(done) {
        collection.find().exec(function(err, data) {
          if(err) return done(err);

          data[0].preferences.remove(1);
          assert(data[0].associations.preferences.removeModels.length === 1);

          done();
        });
      });

    });
  });
});
