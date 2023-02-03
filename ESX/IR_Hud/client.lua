local cash, tether, bank = 0, 0, 0
local isPaused = false
local ToggleHud = false
local playersCount = 0
local debugMode = false
local timeTable = nil
local lastDamage = -1
local inVehicle = false

local cur_seconds = -1
local cur_minutes = -1
local cur_hours = -1

RegisterCommand('reloadhud', function()
  TriggerServerEvent('Ir_Hud:setInfo')
end)

RegisterCommand('togglehud',function ()
	ToggleHUD = not ToggleHUD
	TogglerHud()
  exports["IR_streetLabel"]:Hide((not ToggleHUD))
end)

RegisterNetEvent('ir_hud:initHud')
AddEventHandler('ir_hud:initHud', function(xPlayer)
  TriggerServerEvent('Ir_Hud:setInfo')
end)

function TogglerHud()
	SendNUIMessage({action = 'toggleHud'})
end

Citizen.CreateThread(function()
  Citizen.Wait(10)
  while true do
      Citizen.Wait(250)
      local playerTalking = NetworkIsPlayerTalking(PlayerId())
      SendNUIMessage({action = 'isUserSpeaking',data = playerTalking})
  end
end)

Citizen.CreateThread(function()
    while true do
      if (playersCount == 0) then
        Citizen.Wait(500) --We wait for script to init
      else
        TriggerServerEvent('ls_hud:UpdatePlayerCount')
        Citizen.Wait(2 * 6000)
      end
    end
end)


Citizen.CreateThread(function()
	while true do
    if (timeTable == nil) then
      Citizen.Wait(500) -- Wait for script to init
    else

        Citizen.Wait(2000)
    end
	end
end)

local status = {}
AddEventHandler("esx_status:onTick", function(Status)
  if (playersCount == 0) then
    return
  end

  status['hunger'] = Status[1].percent
  status['thirst'] = Status[2].percent

  SendNUIMessage({action = 'updateHunger', data = status['hunger']})
  SendNUIMessage({action = 'updateThirst', data = status['thirst']})

  if debugMode == true then
    print("[DEBUG MODE] Updated hunger and thirst")
  end
end)


Citizen.CreateThread(function()
  while true do
      Citizen.Wait(100)

      local player = PlayerPedId()
      if IsPedInAnyVehicle(player, false) then
          -- Vehicle Speed
          if inVehicle == false then
            inVehicle = true
          end
          
          local vehicle = GetVehiclePedIsIn(player, false)
          local vehicleIsOn = GetIsVehicleEngineRunning(vehicle)
          local vehicleSpeedSource = GetEntitySpeed(vehicle)
          local LockStatus = GetVehicleDoorLockStatus(vehicle)
          local islocked = false
          local vehicleSpeed
          vehicleSpeed = math.ceil(vehicleSpeedSource * 3.6)

          -- Vehicle Fuel and Gear

         local vehicleFuel
          vehicleFuel = math.floor(GetVehicleFuelLevel(vehicle))
          local vehicleGear = GetVehicleCurrentGear(vehicle)
          local _,light = GetVehicleLightsState(vehicle)
          if (vehicleSpeed == 0 and vehicleGear == 0) then
              vehicleGear = 'N'
          elseif (vehicleSpeed == 0 and vehicleGear == 1) then
              vehicleGear = tostring(vehicleGear)
          elseif vehicleSpeed > 0 and vehicleGear == 0 then
              vehicleGear = 'R'
          end
          if LockStatus == 2 or LockStatus == 3 or LockStatus == 10 or LockStatus == 4 then
            islocked = true
          end
          if vehicleIsOn == 1 then
            vehicleIsOn = true
          end

          if lastDamage ~= GetEntityHealth(vehicle) then
            lastDamage = GetEntityHealth(vehicle)
            SendNUIMessage({action = 'handleDamage', data = lastDamage})
          end

          SendNUIMessage({action = 'updateHudFuel',data = vehicleFuel})
          SendNUIMessage({action = 'updateCarHud',data = {speed = vehicleSpeed, geer = vehicleGear}})
          SendNUIMessage({action = 'toggleCarHud',data = true})
          SendNUIMessage({action = 'handleEngine',data = vehicleIsOn})
          SendNUIMessage({action = 'handleBeam',data = light})
          SendNUIMessage({action = 'handleLock',data = islocked})
      else
        if inVehicle == true then
            inVehicle = false
            SendNUIMessage({action = 'toggleCarHud', data = false})
            SendNUIMessage({action = 'handleEngine', data = false})
            lastDamage = -1
        end
          
          Citizen.Wait(1000)  -- Performance
      end

  end
end)

AddEventHandler('IR_Hud:Seatbelt', function(state)
  SendNUIMessage({action = 'handleBelt',data = state})
end)


RegisterNetEvent("ls_hud:updatePlayerCountClient")
AddEventHandler('ls_hud:updatePlayerCountClient', function(arg)
  if playersCount ~= arg then
    playersCount = arg
    SendNUIMessage({
      action = 'updatePlayerCount', 
      data = arg
    })
    if debugMode == true then
      print("[IRWORLDHUD] Updated player count")
    end
  end
end)

RegisterNetEvent("esx:setJob")
AddEventHandler('esx:setJob', function(job)
  Job = nil
  if job.name == 'unemployed' then 
    Job = 'Civilian'
  else
    Job = job.label..' | '..job.grade_label
  end
  SendNUIMessage({action = 'playerName',data = Job})
end)


-- Pause Menu
CreateThread(function()
	while true do
		Wait(300)

		if not IsPauseMenuActive() and not isPaused and ToggleHUD then
			isPaused = true
			SendNUIMessage({action = 'toggleHud'})
		elseif IsPauseMenuActive() and isPaused and ToggleHUD then
			isPaused = false
			SendNUIMessage({action = 'toggleHud'})
		end
	end
end)

--Update second
CreateThread(function()
  while true do 
    if cur_seconds ~= -1 then 
      Citizen.Wait(1000)
      cur_seconds = cur_seconds + 1

      if (cur_seconds >= 60) then
        cur_seconds = 0 
        cur_minutes = cur_minutes + 1
      end
      if (cur_minutes >= 60) then 
        cur_minutes = 0
        cur_hours = cur_hours + 1 
      end
      if (cur_hours >= 24) then
        cur_hours = 0
      end
      UpdateTimeFromThread()-- Update HUD
    else
        Citizen.Wait(500)
    end
  end
end)

function UpdateTimeFromThread()
  local newTable = {
    cur_hours,
    cur_minutes,
    cur_seconds
  }
  
  local str = ''
  local index = 0
  for k,v in ipairs(newTable) do
    index = index + 1
    local newValue
    if v == 0 then
      newValue = "00"
    else 
      newValue = v 
    end
    str = str .. newValue
    if (index <= 2) then 
      str = str .. ':'
    end
  end
  SendNUIMessage({action = 'updateTime', data = str})
end 
RegisterNetEvent('esx:setAccountMoney')
AddEventHandler('esx:setAccountMoney', function(account)
    if account.name == 'money' then
      cash =  account.money
    elseif account.name == 'bank' then
      bank = account.money
    end
    SendNUIMessage({action = 'updateMoney',data = {cash = cash,bank=bank}})
end)


RegisterNetEvent('Ir_Hud:setInfo')
AddEventHandler('Ir_Hud:setInfo', function(info)
    playersCount = info['connectedPlayers']
    cash =  info['cash']
    bank = info['bank']
    timeTable = info['initialDate']

    cur_seconds = timeTable.sec
    cur_minutes = timeTable.min
    cur_hours   = timeTable.hour

    local correctYear = string.sub((tostring(timeTable.year)), 3)
    local finalDate = timeTable.day .. "/" .. timeTable.month .. "/" .. correctYear
    local finalTime = timeTable.hour .. ":" .. timeTable.min .. ":" .. timeTable.sec
    SendNUIMessage({action = 'updateDate', data = finalDate})
    SendNUIMessage({action = 'updateTime', data = finalTime})
    SendNUIMessage({action = 'updateMoney',data = {cash = cash,bank=bank}})
    SendNUIMessage({action = 'playerName', data = info['job']})
    SendNUIMessage({
      action = 'updatePlayerCount', 
      data = info['connectedPlayers']
    })
    ToggleHUD = not ToggleHUD
    TogglerHud()
end)