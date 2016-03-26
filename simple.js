SimpleJS = {};
SimpleJS.utilities = {};

SimpleJS.utilities.array = {

    slice : function(array, a, b, next) {

        SimpleJS.utilities.check.isArray(array, function(isArray) {

            SimpleJS.utilities.check.isNotEqual(isArray, false, function(isNotFalse) {

                SimpleJS.utilities.check.isNumeric(a, function(isNumA) {

                    SimpleJS.utilities.check.isNumeric(a, function(isNumB) {

                        if (isNotFalse === true) {
                            if (isNumA === true && isNumB === true) {
                                next(Array.prototype.slice.call(array, a, b));
                            } else if (isNumA === true) {
                                next(Array.prototype.slice.call(array, a));
                            } else {
                                next(Array.prototype.slice.call(array));
                            }
                        } else {
                            next(isArray);
                        }

                    });    

                });    


            })

        })

    },

    copy : function(array, next) {

        var result = [];

        SimpleJS.utilities.loop.array(array, function(a,b,c,endLoop) {

            result[a] = JSON.parse(JSON.stringify(b)); //synchrone!
            if (endLoop === true) {
                next(result);
            }

        });
    },

    ensure : function(thing, next) {

        SimpleJS.utilities.check.doesExist(thing, function(answer) {

            if ( answer === false ) {
                thing = []
            }

            SimpleJS.utilities.check.isArray(thing, function(answer) {

                var result;
                if ( answer === false ) {
                    result = [ thing ];
                } else {
                    result = thing;
                }

                next(result);

            })

        })
    },

    get : function (array, key, next) {

        SimpleJS.utilities.check.isArray(array, function(isArray) {

            SimpleJS.utilities.check.isNotEqual(isArray, false, function(isNotFalse) {


                if(isNotFalse === true) {

                    SimpleJS.utilities.check.isNumeric(key, function(isNum) {

                        if (isNum === true) {

                            next(array[key]);

                        } else {

                            switch (key) {

                                case 'first':
                                    next(array[0]);
                                    break;

                                case 'last':
                                    next(array[array.length-1]);
                                    break;

                                default:
                                    break;
                            }

                        }

                    });


                } else {

                    next(isArray);

                }

            });

        });

    },

    insert : function(arr, index, item, next) { //untested

        arr.splice(index, 0, item);
        next(arr);

    },

    merge : function(a, b, next) { //untested

        var result;

        this.copy(arguments, function(args) {

            var master = args.shift();
            result = args.shift();

            SimpleJS.utilities.loop.array(master, function(x,y,z, endLoop) {

                SimpleJS.utilities.check.inArray(x, args, function(prohibed) {

                    if ( ! prohibed ) {
                        if (master[x]) result[x] = y;
                    }

                    if (endLoop === true) {
                        next(result);
                    }

                });

            });

        });

    },

    del : function(array,key, next) { //untested

        var index = array.indexOf(key);
        if (index > -1) {
            array.splice(index, 1);
            next(true);
        } else {
            next(false);
        }

    }

}
SimpleJS.utilities.check = {

    hasClass : function (element, cls, next) {
        this.doesExist(cls, function(doesExist) {
            if ( doesExist === false ) {
                next(false);
            } else {
                this.isHTML(element, function(isHTML) {
                    if (isHTML === false) {
                        next(false);
                    } else {
                        next((' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1);
                    }
                });
            }
        });
    },

    doesExist : function (thing, next) {
        if(thing) {
            next(true);
        } else {
            next(false);
        }
    },

    type : function (thing, next) {

        var result = Object.prototype.toString.call(thing);
        next(result);

    },

    objectSize : function(obj, next) {

        next(Object.keys(obj).length); //Compatibility issue with old browsers, and of course with IE8 (who cares? not me)

    },

    isArray : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        this.type(thing, function(type) {
            if(type === '[object Array]'){
                next(true);
            }else{
                next(false);
            }
        });
        //     } else {
        //         next(false);
        //     }
        // }.bind(this));
    },

    isString : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        this.type(thing, function(type) {
            if(type === '[object String]'){
                next(true);
            }else{
                next(false);
            }
        });
        //    } else {
        //        next(false);
        //    }
        //}.bind(this));
    },

    isNumeric : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        this.type(thing, function(type) {
            if(type === '[object Number]'){
                next(true);
            }else{
                next(false);
            }
        });
        //    } else {
        //        next(false);
        //    }
        //}.bind(this));
    },

    isObject : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //   if (doesExist === true) {
        this.type(thing, function(type) {
            if(type === '[object Object]'){
                next(true);
            }else{
                next(false);
            }
        });
        //     } else {
        //         next(false);
        //     }
        // }.bind(this));
    },

    isBool : function(thing, next) {
        this.doesExist(thing, function(doesExist) {
            // if (doesExist === true) {
            //     this.type(thing, function(type) {
            if(type === '[object Boolean]'){
                next(true);
            }else{
                next(false);
            }
        });
        //  } else {
        //      next(false);
        //  }
        //}.bind(this));
    },

    isTrue : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        this.isBool(thing, function (isBool) {
            if (isBool === true && thing === true) {
                next(true);
            } else {
                next(false);
            }
        });
        //    } else {
        //            next(false);
        //    }
        //});
    },

    isTruthy : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        if (thing) {
            next(true);
        } else {
            next(false);
        }
        //     } else {
        //         next(false);
        //     }
        // });
    },

    isFalse : function(thing, next) {
        this.isTrue(thing, function(isTrue) {
            next( ! isTrue);
        });
    },

    isFalsy : function(thing, next) {
        this.isTruthy(thing, function(isTruthy) {
            next( ! isTruthy);
        });
    },

    isArguments : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        this.type(thing, function(type) {
            if(type === '[object Arguments]'){
                next(true);
            }else{
                next(false);
            }
        });
        //    } else {
        //        next(false);
        //    }
        //}.bind(this));
    },

    isFunction : function(thing, next) {
        //this.doesExist(thing, function(doesExist) {
        //    if (doesExist === true) {
        this.type(thing, function(type) {
            if(type === '[object Function]'){
                next(true);
            }else{
                next(false);
            }
        });
        //    } else {
        //        next(false);
        //    }
        //}.bind(this));
    },

    isJSON : function(str, next) {
        try {
            JSON.parse(str);
            next(true);
        } catch (e) {
            next(false);
        }
    },

    isHTML : function(thing, next) {
        //   this.doesExist(thing, function(doesExist) {
        //       if (doesExist === true) {
        this.type(thing, function(type) {
            SimpleJS.utilities.unix.grep('HTML', type, function(match) {
                this.doesExist(match, function(hasMatched) {
                    if (hasMatched) {
                        next(true);
                    } else {
                        next(false);
                    }
                });
            });
        });
        //        } else {
        //            next(false);
        //        }
        //    }.bind(this));
    },

    isNotHTML : function(thing, next) {
        this.isHTML(thing, function(isHTML) {
            next( ! isHTML);
        });
    },

    isEqual : function(thing, ref, next) {
        if (thing === ref) {
            next(true);
        } else {
            next(false);
        }
    },

    isNotEqual : function(thing, ref, next) {
        this.isEqual(thing, function(isEqual) {
            next( ! isEqual);
        });
    },

    inArray : function(value, array, next) {
        this.isArray(array, function(isArray) {
            if (isArray === true) {
                if(array.indexOf(value) > -1) {
                    next(true);
                } else if (array.indexOf(parseInt(value)) > -1) { 
                    next(true);
                } else {
                    next(false);
                }
            } else {
                next(false);
            }
        });
    },

    inObjectValue : function(value, object, next) {
        var result = false;
        SimpleJS.utilities.loop.object.simple(object, function(a,b,c,endLoop) {
            if (value === b) result = true;
            if (endLoop === true) {
                next(result);    
            }
        });
    },

    inObjectValueDeep : function(value, object, next) {
        var result = false;
        SimpleJS.utilities.loop.object.recursive(object, function(a,b,c,endLoop) {
            if (value === b) result = true;
            if (endLoop === true) {
                next(result);    
            }
        });
    },

    inObjectKey : function(value, object, next) {
        var result = false;
        SimpleJS.utilities.loop.object.simple(object, function(a,b,c,endLoop) {
            if (value === a) result = true;
            if (endLoop === true) {
                next(result);    
            }
        });
    },

    inObjectKeyDeep : function(value, object, next) {
        var result = false;
        SimpleJS.utilities.loop.object.recursive(object, function(a,b,c,endLoop) {
            if (value === a) result = true;
            if (endLoop === true) {
                next(result);    
            }
        });
    },

    getDocHeight : function(next) { //synchrone!
        var result;
        var D = document;
        result = Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
                );
        next(result);
    },

    isEventSupported : function(eventName, next) { //synchrone!
        var el = document.createElement('div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }
        el = null;
        next(isSupported);
    }

}
SimpleJS.utilities.date = {


    getCurrentTimestamp : function (next) {

        next(Date.now());

    }


}
SimpleJS.utilities.loop = {

    array : function (arr, callback) {

        var v = arr.length;

        if(v === 0) {
            callback(arr,false,false,true);
        }

        for (var i = 0; i < v; i++) {
            SimpleJS.utilities.check.isEqual(i,v-1,function(endLoop) {
                callback(i,arr[i],arr,endLoop);
            });
        }
    },

    forG : function (a, b, callback, next) {


        for (i=a;i<b;i++) {
            callback(i);
            if ( i === b-1 ) {
                next();
            }
        }

    },

    forL : function (a, b, callback, next) {

        for (i=a;i>b;i--) {
            callback(i);
            if ( i === b+1 ) {
                next();
            }
        }

    },

    forLoE : function (a, b, callback, next) {

        for (i=a;i>=b;i--) {
            callback(i);
            if ( i === b ) {
                next();
            }
        }

    },

    object : {

        simple : function(o, callback) {

            SimpleJS.utilities.check.objectSize(o, function(size) {

                var counter = 1;

                if(size === 0) {
                    callback(o,false,false,true);
                } else {
                    for(var i in o) {
                        if(o.hasOwnProperty(i)) {
                            if(callback) {
                                SimpleJS.utilities.check.isEqual(counter++,size,function(endLoop) {
                                    callback(i,o[i],o,endLoop);
                                });
                            };
                        };
                    };
                };

            });
        },

        recursive : function(o, callback) { //cant work because object size is not being well calculated
            alert('broken recursive loop function');
            return;

            SimpleJS.utilities.check.objectSizeDeep(o, function(size) {

                var counter = 1;

                if(size === 0) {
                    callback(o,false,false,true);
                }

                for(var i in o) {
                    if(o.hasOwnProperty(i)) {
                        if(callback) {
                            if(callback) {
                                SimpleJS.utilities.check.isEqual(counter++,size,function(endLoop) {
                                    callback(i,o[i],o,endLoop);
                                });
                            }
                        };

                        if(SimpleJS.utilities.check.isObject(o[i])) {
                            this.recursive(o[i],callback);
                        };
                    };
                };

            });
        },

    }

}
SimpleJS.utilities.number = {

    random : function (min, max, next) {
        var result;
        if(!min) min = 0;
        if(!max) max = 1000000;
        result = Math.floor(Math.random() * max) + min;
        next(result);
    }

}
SimpleJS.utilities.object = {

    merge : {

        nonDestructive : function(obj1, obj2, next) {
            var result = {};
            for (var attrname in obj1) { result[attrname] = obj1[attrname]; }
            for (var attrname in obj2) { result[attrname] = obj2[attrname]; }
            next(result);
        }


    }


}
SimpleJS.utilities.string = {


    getLastPart : function (sign, string, next) {

        var result;
        var rest;

        rest = string.split(sign);
        result = rest.pop();
        rest = rest.join(sign);

        next(result,rest);

    }



}
SimpleJS.utilities.unix = {

    grep : function(str, context, cbk) {

        SimpleJS.utilities.check.isString(str, function(isStringStr) {
            SimpleJS.utilities.check.isString(context, function(isStringCtx) {
                if (isStringStr === true && isStringCtx === true) {
                    next(context.match(str));
                } else {
                    next(false);
                }
            });
        });
    }
}
