#!/bin/bash
echo "sleeping for 10 seconds"
echo mongo_setup.sh time now: `date +"%T" `
mongo <<EOF
  var cfg = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongo1:27017",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "mongo2:27017",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "mongo3:27017",
        "priority": 0
      }
    ],settings: {chainingAllowed: true}
  };
  rs.initiate(cfg, { force: true });
  rs.reconfig(cfg, { force: true });
  rs.secondaryOk();
  db.getMongo().setReadPref('nearest');
  db.getMongo().setSecondaryOk();
EOF

sleep 10

mongo <<EOF
   use admin;
   admin = db.getSiblingDB("admin");
   admin.createUser(
     {
	user: "admin",
        pwd: "password",
        roles: [ { role: "root", db: "admin" } ]
     });
     db.getSiblingDB("admin").auth("admin", "password");
     rs.status();
EOF