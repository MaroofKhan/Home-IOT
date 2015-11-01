package com.fyp.waqasansari.raspberryconnection;

import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothSocket;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Set;
import java.util.UUID;


public class MainActivity extends ActionBarActivity {
    BluetoothAdapter myBluetooth = null;
    private Set<BluetoothDevice> pairedDevices;
    static final UUID myUUID = UUID.fromString("94f39d29-7d6d-437d-973b-fba39e49d4ee");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnUnlock = (Button) findViewById(R.id.btnUnlock);
        btnUnlock.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    ConnectAndUnlockTheDoor();
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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



    private void ConnectAndUnlockTheDoor() throws IOException, NoSuchMethodException, InvocationTargetException, IllegalAccessException, InterruptedException {
        //BluetoothManager btManager = (BluetoothManager) getSystemService(getApplicationContext().BLUETOOTH_SERVICE);
        myBluetooth = BluetoothAdapter.getDefaultAdapter();
        Thread.sleep(500);
        if (!myBluetooth.isEnabled()) {
            myBluetooth.enable();
        }
        Thread.sleep(500);
        pairedDevices = myBluetooth.getBondedDevices();
        if(pairedDevices.size() > 0) {
            for (final BluetoothDevice bt : pairedDevices) {
                if (bt.getAddress().equals("00:15:83:15:A3:10")) {
                    myBluetooth.cancelDiscovery();
                    ConnectThread connectThread = new ConnectThread(bt);
                    connectThread.start();
                }
            }
        }



                    /*try
                    {
                        Log.d("", "Connecting...");
                        BluetoothDevice btDevice = myBluetooth.getRemoteDevice(bt.getAddress());
                        //Method m = btDevice.getClass().getMethod("createRfcommSocket", new Class[]{int.class});
                        //btSocket = (BluetoothSocket) m.invoke(btDevice,1);
                        msg("Connecting...");
                        btSocket = btDevice.createRfcommSocketToServiceRecord(myUUID);//create a RFCOMM (SPP) connection
                        myBluetooth.cancelDiscovery();
                        Thread.sleep(500);
                        if (!btSocket.isConnected()){
                            btSocket.connect();//start  connection
                            msg("Connected");
                        }
                        unlockTheDoor(btSocket);
                    }
                    catch (IOException e) {
                        Log.d("Connection Exception", e.toString());
                        /*BluetoothSocket fallbackSocket;
                        Class<?> clazz = btSocket.getRemoteDevice().getClass();
                        Class<?>[] paramTypes = new Class<?>[] {Integer.TYPE};

                        Method m = clazz.getMethod("createRfcommSocket", paramTypes);
                        Object[] params = new Object[] {Integer.valueOf(1)};

                        fallbackSocket = (BluetoothSocket) m.invoke(btSocket.getRemoteDevice(), params);
                        fallbackSocket.connect();
                        unlockTheDoor(fallbackSocket);
                        msg("Connected");
                        /*Method m = bt.getClass().getMethod("createInsecureRfcommSocket", new Class[]{int.class});
                        btSocket = (BluetoothSocket) m.invoke(bt,1);
                        if(!btSocket.isConnected()) {
                            btSocket.connect();//start  connection
                            msg("Connected");
                        }
                        unlockTheDoor();
                        /*final ProgressDialog pd;
                        pd = ProgressDialog.show(this, "Error", "Reconnecting...",true,false);
                        new Thread(new Runnable() {
                            @Override
                            public void run() {
                                ConnectToBT(bt);
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        pd.dismiss();
                                    }
                                });
                            }
                        }).start();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }*/


    }

    private void msg(String s)
    {
        Toast.makeText(getApplicationContext(), s, Toast.LENGTH_LONG).show();
    }

    private void unlockTheDoor(BluetoothSocket socket) throws IOException {
        String data = "ahsun";
        if (socket!=null)
        {
            try
            {
                Log.d("Send data", "Sending...");
                socket.getOutputStream().write(data.getBytes());
                Log.d("Send data", "Sent");
                socket.close();
            }
            catch (IOException e)
            {
                Log.d("Sending Exception", e.toString());
                socket.close();
            }
        }
    }

    private class ConnectThread extends Thread{
        private final BluetoothDevice btDevice;
        private BluetoothSocket btSocket;

        private ConnectThread(BluetoothDevice device) {
            Log.d("", "Initializing...");
            btDevice = device;
            BluetoothSocket tmp = null;
            try {
                tmp = btDevice.createRfcommSocketToServiceRecord(myUUID);
                //Method m = btDevice.getClass().getMethod("createInsecureRfcommSocket", new Class[]{int.class});
                //tmp = (BluetoothSocket) m.invoke(btDevice,1);
            } catch (IOException e) {
                e.printStackTrace();
            }
            btSocket = tmp;
        }

        public void run(){
            Log.d("", "Connecting...");
            try {
                if (!btSocket.isConnected())
                    btSocket.connect();
                Log.d("", "Connected");
                try {
                    unlockTheDoor(btSocket);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } catch (IOException e) {
                Log.d("Connect Error", e.toString());
                try{
                    Log.d("", "Trying fallback...");
                    btSocket =(BluetoothSocket) btDevice.getClass().getMethod("createRfcommSocket", new Class[] {int.class}).invoke(btDevice,2);
                    btSocket.connect();
                    Log.d("", "Connected");
                    try {
                        unlockTheDoor(btSocket);
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    }
                } catch (InvocationTargetException e1) {
                    e1.printStackTrace();
                } catch (NoSuchMethodException e1) {
                    e1.printStackTrace();
                } catch (IllegalAccessException e1) {
                    e1.printStackTrace();
                } catch (IOException e1) {
                    e1.printStackTrace();
                    try {
                        Log.d("", "Something goes wrong");
                        Log.d("", "Reconnecting...");
                        btSocket.close();
                        Thread.sleep(2000);
                        myBluetooth.cancelDiscovery();
                        ConnectThread connectThread = new ConnectThread(btDevice);
                        connectThread.start();
                    } catch (IOException e2) {
                        e2.printStackTrace();
                    } catch (InterruptedException e2) {
                        e2.printStackTrace();
                    }
                }
            }


        }

        public void cancel(){
            try {
                btSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


}
