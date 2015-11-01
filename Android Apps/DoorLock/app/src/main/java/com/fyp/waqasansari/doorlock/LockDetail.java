package com.fyp.waqasansari.doorlock;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import com.fasterxml.jackson.annotation.JsonValue;
import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.firebase.client.ValueEventListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;


public class LockDetail extends ActionBarActivity {
    private ArrayList<HashMap<String, String>> list;
    String HistoryData=null;
    HashMap<String,String> temp;
    ListView listView;
    String name;



    //*****************************************
    String address;
    BluetoothSocket btSocket = null;
    private boolean isBtConnected = false;
    private BluetoothAdapter myBluetooth = null;
    private Set<BluetoothDevice> pairedDevices;
    static final UUID myUUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    //*****************************************



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lock_detail);
        Intent intent = getIntent();
        name = intent.getStringExtra("USERNAME");
        String firebaseURL = "https://homeiot.firebaseio.com/" + name + "/lock/history";


        Button btnUnlock = (Button) findViewById(R.id.btnUnlock);
        btnUnlock.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    ConnectAndUnlockTheDoor();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });



        Firebase.setAndroidContext(this);

        Firebase myFirebaseRef = new Firebase(firebaseURL);
        myFirebaseRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                try {
                    HistoryData = dataSnapshot.getValue().toString();
                } catch (Exception e){
                    HistoryData=null;
                }
                JSONObject HistoryObject = null;
                try {
                    if (HistoryData != null){
                        list = new ArrayList<HashMap<String, String>>();
                        HistoryObject = new JSONObject(HistoryData);
                        for (int i = 0; i < HistoryObject.names().length(); i++) {
                            JSONObject value = HistoryObject.getJSONObject(HistoryObject.names().getString(i));

                            temp = new HashMap<String, String>();
                            temp.put("name", value.getString("person"));
                            SimpleDateFormat format = new SimpleDateFormat("yyyyMMddhhmmss");
                            Date date = format.parse(value.getString("time"));
                            temp.put("date", date.toString());
                            list.add(temp);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                } catch (ParseException e) {
                    e.printStackTrace();
                }


                listView = (ListView) findViewById(R.id.lstHistory);
                ListDetail adapter = null;
                if(HistoryData != null)
                    adapter = new ListDetail(LockDetail.this, list);
                listView.setAdapter(adapter);

                listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, final View view, int position, long id) {
                        int pos = position + 1;
                        Toast.makeText(LockDetail.this, Integer.toString(pos) + " Clicked", Toast.LENGTH_SHORT).show();
                    }

                });


            }

            @Override
            public void onCancelled(FirebaseError firebaseError) {

            }
        });

        /*if(HistoryData != null) {
            JSONObject HistoryObject = null;
            try {
                HistoryObject = new JSONObject(HistoryData);
                Map<String, JSONObject> map = (Map<String, JSONObject>) HistoryObject;
                ArrayList<String> list = new ArrayList<>(map.keySet());
                Log.d("Keys", list.toString());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }*/



    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_lock_detail, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }





    //*******************************************************************************************************************************
    private void ConnectAndUnlockTheDoor() throws IOException {
        myBluetooth = BluetoothAdapter.getDefaultAdapter();
        if(myBluetooth == null)
        {
            //Show a mensag. that thedevice has no bluetooth adapter
            Toast.makeText(getApplicationContext(), "Bluetooth Device Not Available", Toast.LENGTH_LONG).show();
        }
        else
        {
            if (!myBluetooth.isEnabled())
            { Log.d("Bluetooth", "Enabled");  myBluetooth.enable(); }
        }

        Log.d("OK", "Working");
        pairedDevices = myBluetooth.getBondedDevices();
        if(pairedDevices.size() > 0){
            Log.d("OK", "Working");
            for(BluetoothDevice bt : pairedDevices){
                if(bt.getAddress().equals("98:D3:31:90:49:B3")){
                    Log.d("OK", "Working");
                    address = bt.getAddress();
                    try
                    {
                        if (btSocket == null || !isBtConnected)
                        {
                            myBluetooth = BluetoothAdapter.getDefaultAdapter();//get the mobile bluetooth device
                            BluetoothDevice dispositivo = myBluetooth.getRemoteDevice(address);//connects to the device's address and checks if it's available
                            Method m = dispositivo.getClass().getMethod("createRfcommSocket", new Class[]{int.class});
                            btSocket = (BluetoothSocket) m.invoke(dispositivo,1);
                            //btSocket = dispositivo.createInsecureRfcommSocketToServiceRecord(myUUID);//create a RFCOMM (SPP) connection
                            BluetoothAdapter.getDefaultAdapter().cancelDiscovery();
                            Thread.sleep(500);
                            btSocket.connect();//start connection

                            msg("Connected.");
                            Log.d("Connected", "To device");
                        }
                    }
                    catch (IOException e) { msg("Something goes wrong");  } catch (InterruptedException e) {
                        e.printStackTrace();
                    } catch (InvocationTargetException e) {
                        e.printStackTrace();
                    } catch (NoSuchMethodException e) {
                        e.printStackTrace();
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }

                    isBtConnected = true;
                    unlockTheDoor();
                }
            }
        }
    }

    private void msg(String s)
    {
        Toast.makeText(getApplicationContext(), s, Toast.LENGTH_LONG).show();
    }

    private void unlockTheDoor() throws IOException {
        String jsonString = "{'unlocker' : \"" + name + "\"}";
        if (btSocket!=null)
        {
            try
            {
                btSocket.getOutputStream().write("TO".getBytes());
                btSocket.getOutputStream().write("*".getBytes());
                try{
                    Thread.sleep(500);
                } catch (InterruptedException e) {  e.printStackTrace();    }

                btSocket.getOutputStream().write(jsonString.getBytes());
                Thread.sleep(1500);
                btSocket.close();
                isBtConnected=false;
            }
            catch (IOException e)
            {
                Log.d("ERROR", e.toString());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    //*******************************************************************************************************************************














}
