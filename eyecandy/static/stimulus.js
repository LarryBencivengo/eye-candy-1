const PI = Math.PI
const pow = Math.pow
const sqrt = Math.sqrt
const sin = Math.sin
const cos = Math.cos

/************************************************
REDUX (GLOBAL STATE)
************************************************/

const createStore = Redux.createStore

/***********************************************/
// ACTIONS

const TICK = 'TICK'
const STIMULUS_TICK = 'STIMULUS_TICK'
const SET_STATUS = 'SET_STATUS'
const GET_NEW_STIMULUS = 'GET_NEW_STIMULUS'
const SET_PROGRAM = 'SET_PROGRAM'
const SET_GRAPHICS = 'SET_GRAPHICS'
const ADD_GRAPHIC = 'ADD_GRAPHIC'
const REMOVE_GRAPHIC = 'REMOVE_GRAPHIC'
const SET_SIGNAL_LIGHT = 'SET_SIGNAL_LIGHT'

// Define states for readability
const STATUS = {
    STARTED: 'STARTED',
    STOPPED: 'STOPPED',
    FINISHED: 'FINISHED'
}

const SIGNAL_LIGHT = {
    FRAME_A: 'FRAME_A',
    FRAME_B: 'FRAME_B',
    NEW_STIM: 'NEW_STIM'
}

const PROGRAM = {
    ORIENTATION_SELECTIVITY: 'ORIENTATION_SELECTIVITY',
    /*
    {
        programType: PROGRAM.ORIENTATION_SELECTIVITY,
        speed: 1,
        preTime: 0,
        interTime: 0,
        postTime: 0,
        barWidth: 20,
        orientations: [0, PI/2, PI, 3*PI/2]
    }
    */
    MOVING_BAR: 'MOVING_BAR'
    /*
    {
        programType: PROGRAM.MOVING_BAR,
        speed: 1,
        preTime: 0,
        interTime: 0,
        postTime: 0,
        barWidth: 20,
    }
    */
}
const STIMULUS = {
    BAR: 'BAR'
    /*
    {
        position: {x: 0, y: 0},
        size: {width: 20, height: 10},
        speed: 1,
        angle: 0,
    }
    */
}

const GRAPHIC = {
    BAR: 'BAR'
}

/***********************************************/
// ACTION CREATORS

function makeActionCreatorAccessor(type, ...argNames) {
    return function(...args) {
        let action = { type }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}

function tick(timeDelta) {
    store.dispatch(stimulusTick())
    state = store.getState()
    // check if stimulus expired then update signal light
    if (state.stimulus.age >= state.stimulus.lifespan) {
        store.dispatch(getNewStimulus())
        // TODO generate new graphics?
        store.dispatch(setSignalLight(SIGNAL_LIGHT.NEW_STIM))
    } else {
        if (state.signalLight===SIGNAL_LIGHT.FRAME_A) {
            store.dispatch(setSignalLight(SIGNAL_LIGHT.FRAME_B))
        } else {
            store.dispatch(setSignalLight(SIGNAL_LIGHT.FRAME_A))            
        }
    }

    store.dispatch(globalTick(timeDelta))
}

function stimulusTick(timeDelta) {
    return {type: STIMULUS_TICK, timeDelta: timeDelta}
}

function globalTick(timeDelta) {
    return { type: TICK, timeDelta: timeDelta}
}

function addGraphic(graphic) {

    return { type: ADD_GRAPHIC, graphic: 'TODO' }
}

function getNewStimulus(GET_NEW_STIMULUS, stimulus) {
    return {type: GET_NEW_STIMULUS}
}


const setStatus = makeActionCreatorAccessor(SET_STATUS, 'status')
const setProgram = makeActionCreatorAccessor(SET_PROGRAM, 'program')
const setGraphics = makeActionCreatorAccessor(SET_GRAPHICS, 'graphics')
const setSignalLight = makeActionCreatorAccessor(SET_SIGNAL_LIGHT, 'signalLight')


/***********************************************/
// REDUCERS

const accessorInitialState = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    status: STATUS.STOPPED,
    // program: {
    //     programType: PROGRAM.MOVING_BAR,
    //     speed: 1,
    //     preTime: 0,
    //     interTime: 0,
    //     postTime: 0,
    //     barWidth: 20,
    // },
    // stimulus: {},
    program: {},
    stimulus: {
        stimulusType: STIMULUS.BAR,
        lifespan: 500
    },
    graphics: [{
        graphicType: GRAPHIC.BAR,
        color: '#FFFFFF',
        // Note: height of the Rectangle is bar width
        size: {width: 20, height: getDiagonalLength()},
        speed: 10,
        angle: -3*PI/4
    }],
    // signalLight in range(0,255)
    signalLight: 0,
    time: 0
}

function eyeCandyApp(state = accessorInitialState, action) {
    switch (action.type) {
        case SET_STATUS:
            return Object.assign({}, state, {
                status: action.status
            })
        case GET_NEW_STIMULUS:
            const nextStimulus = state.program.next()
            return Object.assign({}, state, {
                stimulus: nextStimulus  
            })
        case SET_GRAPHICS:
            return Object.assign({}, state, {
                graphics: action.graphics
            })
        case ADD_GRAPHIC:
            return Object.assign({}, state, {
                graphics: [...state.graphics, action.graphic]
            })
        case SET_SIGNAL_LIGHT:
            return Object.assign({}, state, {
                signalLight: action.signalLight
            })
        case TICK:
            return tickReducer(state, action)
        case STIMULUS_TICK:
            return Object.assign({}, state, {
                stimulus: stimulusTickReducer(state.stimulus, action.timeDelta)
            })
    default:
      return state
    }
}

function stimulusTickReducer(stimulus, timeDelta) {
    return Object.assign({}, stimulus, {
        age: stimulus.age + timeDelta
    })
}

function tickReducer(state, action) {
    // switch(store.getState()['stimulus']['stimulusType']) {
    //     case STIMULUS.BAR:
    //         return Object.assign({}, state, {
    //             time: ,
    //             graphics: tickBar(state.graphics, action.timeDelta),
    //         }) 

    // return Object.assign({}, state, {
    //     time: newTime,
        
    // })               

    return Object.assign({}, state, {
        time: state.time + action.timeDelta,
        graphics: state.graphics.map(graphic => {
            graphic.graphic.position()
            return Object.assign({}, graphic, {
                graphic: rect
            })
        }).filter((x) => {return x})
    })
}

/***********************************************/
// MIDDLEWARE


/***********************************************/
// GRAPHICS TICK

function graphicTickReducer(state, action) {
    switch ()
}

function tickBar(graphics, timeDelta) {
    return graphics.map(bar => {
        let newPosition = undefined
        if (bar.position === undefined) {
            newPosition = {r: getDiagonalLength(), theta: -bar.angle}
        } else {
            newPosition = {r: bar.position.r - bar.speed*timeDelta, 
                theta: bar.position.theta}
        }

        return Object.assign({}, bar, {
            position: newPosition,
            // compensate for bar width & height, translate from polar & translate from center
            origin: {x: bar.size.width*cos(newPosition.theta) +
                        newPosition.r*cos(newPosition.theta) + WIDTH/2,
                     y: bar.size.width*sin(newPosition.theta) +
                        newPosition.r*sin(newPosition.theta) + HEIGHT/2}
        })
    })
}


/***********************************************/
// STORE

let store = createStore(eyeCandyApp)
// let store = createStore(todoApp, window.STATE_FROM_SERVER)

// TEST

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() => {
        console.log(store.getState().graphics[0].origin)
        // console.log(store.getState().graphics[0].position)
        console.log(store.getState().graphics[0])
    }
)

store.dispatch(setStatus(STATUS.STARTED))
// store.dispatch(setStatus(STATUS.STOPPED))
//  offstore.dispatch(tick())

// Stop listening to state updates
unsubscribe()

/************************************************
// LOGIC
************************************************/

// ensure bar always spans window regardless of angle and
function getDiagonalLength() {
    return sqrt(pow(window.innerWidth, 2) +
        pow(window.innerHeight, 2))
}


/************************************************
CANVAS
************************************************/

const canvas=document.getElementById("eyecandy");
var context = canvas.getContext("2d");
const WIDTH = store.getState()['windowWidth']
const HEIGHT = store.getState()['windowHeight']
context.canvas.width  = WIDTH
context.canvas.height = HEIGHT



function render() {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // TODO remove
    context.strokeStyle = '#ff0000'
    context.beginPath()
    context.arc(WIDTH/2,HEIGHT/2,300,0,2*PI)
    context.stroke()

    store.getState().graphics.forEach(graphic => {
        switch (graphic.graphicType) {
            case GRAPHIC.BAR:
                // might need to translate first if rotation
                context.save()
                context.translate(graphic.origin.x,
                    graphic.origin.y)
                context.fillStyle = graphic.color
                // Rotate rectangle to be perpendicular with Center of Canvas
                context.rotate(graphic.position.theta)
                // Draw a rectangle, adjusting for Bar width
                context.fillRect(-graphic.size.width/2, -graphic.size.height/2,
                    graphic.size.width, graphic.size.height)
                context.restore()
        }
    })
}

function* sampleGen() {
    for (var i = 0; i <= 3; i++) {
        yield i
    }
}

/************************************************
ANIMATE
************************************************/
var lastTime = window.performance.now()
function mainLoop() {
    // var curTime = window.performance.now()
    // console.log(curTime - lastTime)
    // lastTime = curTime
    store.dispatch(tick(1))
    render()
    requestAnimationFrame(mainLoop)
}
mainLoop()
// render()